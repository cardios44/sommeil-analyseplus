
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
    id: "hta",
    text: "Hypertension artérielle",
    options: [
      { value: "no-hta", label: "Pas d'HTA", score: 0 },
      { value: "controlled-hta", label: "HTA contrôlée", score: 0 },
      { value: "uncontrolled-hta", label: "HTA non contrôlée", score: 0 },
      { value: "resistant-hta", label: "HTA résistante", score: 0 },
    ],
  },
  {
    id: "stroke",
    text: "Antécédent d'AVC/AIT",
    options: [
      { value: "no-stroke", label: "Non", score: 0 },
      { value: "tia", label: "AIT", score: 0 },
      { value: "ischemic-stroke", label: "AVC ischémique", score: 0 },
      { value: "hemorrhagic-stroke", label: "AVC hémorragique", score: 0 },
    ],
  },
  {
    id: "cardiac-history",
    text: "Autres antécédents cardiovasculaires",
    options: [
      { value: "mi", label: "Infarctus du myocarde", score: 0 },
      { value: "pci", label: "Angioplastie coronaire", score: 0 },
      { value: "cabg", label: "Pontage aorto-coronarien", score: 0 },
      { value: "valve", label: "Chirurgie valvulaire", score: 0 },
    ],
  },
];
