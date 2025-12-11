import { LocalStorage } from "../Utils";

interface StoreDataToAsyncStoreType {
  imgUrl: string;
  side: string;
  id: string;
  answer?: string;
  totalLength: number;
}

export interface LocalDataType {
  id: string;
  side: Side[];
  totalLength: number;
}

export interface Side {
  type: string;
  img: string;
  questions?: Question[];
}

export interface Question {
  question: string;
  answer?: string;
}

export const HandleStoreDataToAsyncStore = async (
  data: StoreDataToAsyncStoreType
) => {
  const localData: LocalDataType[] = await LocalStorage.get("sync_queue");
  console.log("GOT localData ----> ", localData);
  try {
    if (!Object.keys(localData).length) {
      return await LocalStorage.set("sync_queue", [
        {
          id: data.id,
          side: [
            {
              type: data.side,
              img: data.imgUrl,
              answer: data.answer,
            },
          ],
        },
      ]);
    }

    const allIds = localData.map((item) => item.id);
    // Case if NO Data is present
    if (!allIds.includes(data.id)) {
      localData.push({
        id: data.id,
        side: [
          {
            type: data.side,
            img: data.imgUrl,
          },
        ],
        totalLength: data.totalLength,
      });
      console.log("localData", localData);
      await LocalStorage.set("sync_queue", localData);
      // Indicates that data includes this id
    } else {
      const index = allIds.indexOf(data.id);
      const sideIndex = localData[index].side.findIndex(
        (item) => item.type === data.side
      );
      if (sideIndex !== -1) {
        localData[index].side[sideIndex] = {
          type: data.side,
          img: data.imgUrl,
          questions: [],
        };
      } else {
        localData[index].side.push({
          type: data.side,
          img: data.imgUrl,
          questions: [],
        });
      }
      await LocalStorage.set("sync_queue", localData);
    }
  } catch (error) {
    console.log(error);
  }
};
