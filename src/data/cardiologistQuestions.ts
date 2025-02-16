
export interface CardiologistQuestionOption {
  value: string;
  label: string;
  score: number;
}

export interface CardiologistQuestion {
  id: string;
  text: string;
  options: CardiologistQuestionOption[];
}

export const cardiologistQuestions: CardiologistQuestion[] = [
  {
    id: "cardiac-pathology",
    text: "Pathologie cardiaque principale",
    options: [
      { value: "coronary", label: "Maladie coronarienne", score: 0 },
      { value: "heart-failure", label: "Insuffisance cardiaque", score: 0 },
      { value: "arrhythmia", label: "Trouble du rythme", score: 0 },
      { value: "other", label: "Autre", score: 0 },
    ],
  },
  {
    id: "nyha-class",
    text: "Classe NYHA",
    options: [
      { value: "class-1", label: "Classe I", score: 0 },
      { value: "class-2", label: "Classe II", score: 0 },
      { value: "class-3", label: "Classe III", score: 0 },
      { value: "class-4", label: "Classe IV", score: 0 },
    ],
  },
  {
    id: "treatment",
    text: "Traitement actuel",
    options: [
      { value: "beta-blockers", label: "Bêtabloquants", score: 0 },
      { value: "ace-inhibitors", label: "IEC/ARA2", score: 0 },
      { value: "diuretics", label: "Diurétiques", score: 0 },
      { value: "anticoagulants", label: "Anticoagulants", score: 0 },
    ],
  },
];
