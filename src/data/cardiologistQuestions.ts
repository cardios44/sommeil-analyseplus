
export interface PatientBasicInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "male" | "female";
  height: number;
  weight: number;
  bmi: number;
  consultationReason: string;
}

export interface CardiologistQuestionOption {
  value: string;
  label: string;
  checked?: boolean;
}

export interface CardiologistQuestion {
  id: string;
  text: string;
  type: "checkbox" | "text";
  options: CardiologistQuestionOption[];
}

export const cardiologistQuestions: CardiologistQuestion[] = [
  {
    id: "current-symptoms",
    text: "Symptômes actuels",
    type: "checkbox",
    options: [
      { value: "chest-pain", label: "Douleur thoracique" },
      { value: "dyspnea", label: "Dyspnée" },
      { value: "palpitations", label: "Palpitations" },
      { value: "fatigue", label: "Fatigue" },
      { value: "syncope", label: "Syncope" },
      { value: "other", label: "Autre" },
    ],
  },
  {
    id: "cardiovascular-history",
    text: "Antécédents cardiovasculaires",
    type: "checkbox",
    options: [
      { value: "ischemic", label: "Cardiopathie ischémique" },
      { value: "stroke", label: "Accident vasculaire cérébral (AVC)" },
      { value: "af", label: "Fibrillation atriale (FA)" },
      { value: "heart-failure", label: "Insuffisance cardiaque" },
      { value: "hta", label: "Hypertension artérielle (HTA)" },
      { value: "other", label: "Autre" },
    ],
  },
  {
    id: "risk-factors",
    text: "Facteurs de risque cardiovasculaire",
    type: "checkbox",
    options: [
      { value: "diabetes", label: "Diabète" },
      { value: "smoking", label: "Tabagisme (actuel ou passé)" },
    ],
  },
];
