
interface Question {
    question: string;
    answer: string;
}

export type SideType = "front" | "back" | "left" | "right" | "chassis" | "chassisImprint";
// export interface SideType {
//     type: "front" | "back" | "left" | "right" | "top" | "bottom" | "chassis" | "chassisImprint";
// }

interface Side {
    type: SideType;
    img: string;
    questions: Question[];
}

interface Chassis {
    img: string;
    questions: Question[];
}

interface Data {
    id: string;
    side: Side[];
    chassisNumber: Chassis;
    chassisImprint: Chassis;
}

export {
    Question,
    Side,
    Chassis,
    Data
}