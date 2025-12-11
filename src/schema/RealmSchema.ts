import Realm from "realm";

interface Question {
    question: string;
    answer: string;
}

interface Side {
    type: "front" | "back" | "left" | "right" | "top" | "bottom" | "chassis" | "chassisImprint";
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

// Define the schema for the Question object
const QuestionSchema: Realm.ObjectSchema = {
    name: "Question",
    properties: {
        question: "string",
        answer: "string",
    },
};

// Define the schema for the Side object
const SideSchema: Realm.ObjectSchema = {
    name: "Side",
    properties: {
        type: "string",
        img: "string",
        questions: "Question[]",
    },
};

// Define the schema for the main data object
const DataSchema: Realm.ObjectSchema = {
    name: "Data",
    properties: {
        id: "string",
        side: "Side[]",
    },
};

// Create the realm with the defined schemas
const realm = new Realm({
    schema: [QuestionSchema, SideSchema, DataSchema],
});

export {
    realm as realmDB
}