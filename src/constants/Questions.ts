import { SideType } from "@src/@types/RealmSchemaTypes";

interface Question {
  question: string;
  answer: string[];
}

export const Questions: Record<string, Question> = {
  "Front Side": {
    question: "Check Fender/Head Lamp/Front Fork/Break/FRONT SHOCK ABSORBER",
    answer: [
      "Good",
      "Average",
      "Bad",
      "Damaged",
      "Rusted",
      "Missing",
      "Scrap",
      "Excellent",
    ],
  },
  "Right Side": {
    question: "Check Fuel Tank/Silencer/Handle Bar",
    answer: [
      "Good",
      "Average",
      "Bad",
      "Damaged",
      "Missing",
      "Rusted",
      "Excellent",
    ],
  },
  "Left Side": {
    question: "Check Clutch lever/Foot Rest/Gear Pedal",
    answer: [
      "Good",
      "Average",
      "Bad",
      "Damaged",
      "Missing",
      "Rusted",
      "Excellent",
    ],
  },
  "Chassis Number": {
    question: "Check Chassis Number and punching condition",
    answer: ["Original", "Repunched", "Damaged", "Bent", "Missing"],
  },
  "Chassis Imprint": {
    question: "Check Chassis Number and punching condition",
    answer: ["Original", "Repunched", "Damaged", "Bent", "Missing"],
  },
  "Back Side": {
    question:
      "Check Tail lamp/Break/Rear Gaurd/SILENCER COVER/REAR SHOCK ABSORBER",
    answer: [
      "Good",
      "Average",
      "Bad",
      "Damaged",
      "Missing",
      "Excellent",
      "Scrap",
    ],
  },
};

/**
 * 
import { SideType } from '@src/@types/RealmSchemaTypes';

interface Question {
    question: string;
    answer: string[];
}

export const Questions: Record<string, Question[]> = {
    'Front Side': [
        {
            question:
                'Check Fender',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Rusted',
                'Missing',
                'Scrap',
                'Excellent',
            ],
        },
        {
            question: 'Check Head Lamp',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Rusted',
                'Missing',
                'Scrap',
                'Excellent',
            ],
        },
        {
            question: 'Check Front Fork',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Rusted',
                'Missing',
                'Scrap',
                'Excellent',
            ],
        },
        {
            question: 'Check Break',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Rusted',
                'Missing',
                'Scrap',
                'Excellent',
            ],
        },
        {
            question: 'Check FRONT SHOCK ABSORBER',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Rusted',
                'Missing',
                'Scrap',
                'Excellent',
            ],
        },
    ],
    'Right Side': [
        {
            question: 'Check Fuel Tank',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Missing',
                'Rusted',
                'Excellent',
            ],
        },
        {
            question: 'Check Silencer',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Missing',
                'Rusted',
                'Excellent',
            ],
        },
        {
            question: 'Check Handle Bar',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Missing',
                'Rusted',
                'Excellent',
            ],
        },
    ],
    'Left Side': [
        {
            question: 'Check Clutch lever/Foot Rest/Gear Pedal',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Missing',
                'Rusted',
                'Excellent',
            ],
        },
    ],
    'Chassis Number': [
        {
            question: 'Check Chassis Number and punching condition',
            answer: ['Original', 'Repunched', 'Damaged', 'Bent', 'Missing'],
        },
    ],
    'Chassis Imprint': [
        {
            question: 'Check Chassis Number and punching condition',
            answer: ['Original', 'Repunched', 'Damaged', 'Bent', 'Missing'],
        },
    ],
    'Back Side': [
        {
            question:
                'Check Tail lamp/Break/Rear Gaurd/SILENCER COVER/REAR SHOCK ABSORBER',
            answer: [
                'Good',
                'Average',
                'Bad',
                'Damaged',
                'Missing',
                'Excellent',
                'Scrap',
            ],
        },
    ],
};

 */

export const TO_SPLIT_QUESTION = [
  "Odometer Reading",
  "Chassis Imprint Image",
  "Odmeter Reading",
].map((item) => item.toLowerCase());
