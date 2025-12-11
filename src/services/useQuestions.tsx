const data = require("../../assets/FILE_MAPPING.json");
import {
  AppStepListDataRecord,
  AppStepListQuestion,
} from "@src/@types/AppStepList";
import { TO_SPLIT_QUESTION } from "@src/constants/Questions";

interface GetSideQuestionProps {
  data: AppStepListDataRecord[];
  vehicleType: string;
  nameInApplication: string;
}

const questionHandler = (questionData: AppStepListQuestion) => {
  const question = questionData?.Questions;
  if (TO_SPLIT_QUESTION.includes(questionData?.Name?.toLowerCase())) {
    if (!question) return "";

    if (typeof question === "string") {
      return question.replaceAll("~", "/").split("/");
    }

    return question.map((item) => item.replaceAll("~", "/"));
  }
  if (typeof question === "string" && question.includes("NO question")) {
    return null;
  }
  if (Array.isArray(question))
    return question.map((item) => item.replaceAll("~", "/"));

  return question;
};

const useQuestions = () => {
  const getSides = (
    data: AppStepListDataRecord[],
    vehicleType: string
  ): string[] => {
    if (!vehicleType) return [];

    console.log("SIDES HERE", data, vehicleType);
    const sides: string[] = data
      .filter(
        (item) => item.VehicleType === vehicleType.toUpperCase() && item.Images
      )
      .map((item) => item.Name);

    console.log("SIDES HERE", sides);
    return sides;
  };

  /**
   * To Get Question based on following parameters:
   *  * Vehicle type i.e 2W, 3W, etc
   *  * NameInApplication
   * @param vehicleType
   * @param nameInApplication
   * @returns
   */
  const getSideQuestion = ({
    data,
    vehicleType,
    nameInApplication,
  }: GetSideQuestionProps): null | AppStepListQuestion => {
    if (!vehicleType || !nameInApplication) return null;

    // const vehicleArrayData = data[vehicleType];
    let question = data.find(
      (item: any) => item["Name"] === nameInApplication
    ) as AppStepListQuestion;

    console.log("question Here", question);
    question = {
      ...question,
      Questions: questionHandler(question),
    };
    console.log("updated question Here", question);
    return question;
  };

  return { getSides, getSideQuestion };
};

export default useQuestions;
