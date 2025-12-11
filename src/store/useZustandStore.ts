import {
  MyTaskValuate,
  MyTaskValuateStoreType,
} from "@src/@types/MyTaskValuate";
import { EMPTY_MY_TASKS_DATA } from "@src/constants/Empty";
import { create } from "zustand";

interface ExtendMyTaskValuateStoreType extends MyTaskValuateStoreType {
  refreshValuatePage: boolean;
  setRefreshValuatePage: (value: boolean) => void;

  uploadingSides: Record<string, boolean>;
  setUploadingSide: (side: string, isUploading: boolean) => void;
}

/** This is data from when user clicks valuate button on my tasks page */
const useZustandStore = create<ExtendMyTaskValuateStoreType>((set) => ({
  myTaskValuate: EMPTY_MY_TASKS_DATA,
  setMyTaskValuate: (value: MyTaskValuate) => set({ myTaskValuate: value }),

  refreshValuatePage: false,
  setRefreshValuatePage: (value: boolean) => {
    set({ refreshValuatePage: value });
  },

  uploadingSides: {},
  setUploadingSide: (side, isUploading) =>
    set((state) => ({
      uploadingSides: { ...state.uploadingSides, [side]: isUploading },
    })),
}));

export default useZustandStore;
