export interface QuestionOption {
  value: string;
  label: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: "duration",
    text: "En moyenne, combien d'heures dormez-vous par nuit ?",
    options: [
      { value: "less-6", label: "Moins de 6 heures", score: 0 },
      { value: "6-7", label: "6 à 7 heures", score: 1 },
      { value: "7-9", label: "7 à 9 heures", score: 2 },
      { value: "9-10", label: "9 à 10 heures", score: 1 },
      { value: "more-10", label: "Plus de 10 heures", score: 0 },
    ],
  },
  {
    id: "regularity",
    text: "Vos heures de coucher et de lever sont-elles régulières ?",
    options: [
      { value: "very-regular", label: "Oui, très régulières (moins d'une heure de décalage)", score: 2 },
      { value: "sometimes-irregular", label: "Parfois irrégulières", score: 1 },
      { value: "often-irregular", label: "Souvent irrégulières", score: 0 },
    ],
  },
  {
    id: "chronotype",
    text: "Vous considérez-vous comme étant plutôt une personne :",
    options: [
      { value: "morning", label: "Du matin", score: 2 },
      { value: "evening", label: "Du soir", score: 1 },
      { value: "neutral", label: "Ni l'un ni l'autre", score: 2 },
    ],
  },
  {
    id: "insomnia",
    text: "Avez-vous des difficultés à vous endormir ou à rester endormi(e) ?",
    options: [
      { value: "none", label: "Aucunement", score: 2 },
      { value: "slightly", label: "Légèrement", score: 1.5 },
      { value: "moderately", label: "Moyennement", score: 1 },
      { value: "much", label: "Beaucoup", score: 0.5 },
      { value: "very-much", label: "Énormément", score: 0 },
    ],
  },
  {
    id: "daily-impact",
    text: "Jusqu'à quel point considérez-vous que vos difficultés de sommeil perturbent votre fonctionnement quotidien (ex. : fatigue durant la journée, capacité à travailler/à effectuer les tâches quotidiennes à la maison, concentration, mémoire et/ou humeur) ?",
    options: [
      { value: "none", label: "0 - Aucunement", score: 2 },
      { value: "slightly", label: "1 - Légèrement", score: 1.5 },
      { value: "moderately", label: "2 - Moyennement", score: 1 },
      { value: "much", label: "3 - Beaucoup", score: 0.5 },
      { value: "very-much", label: "4 - Énormément", score: 0 },
    ],
  },
  {
    id: "satisfaction",
    text: "Jusqu'à quel point êtes-vous SATISFAIT(E)/INSATISFAIT(E) de votre sommeil actuel ?",
    options: [
      { value: "very-satisfied", label: "Très satisfait", score: 2 },
      { value: "satisfied", label: "Satisfait", score: 1.5 },
      { value: "neutral", label: "Plutôt neutre", score: 1 },
      { value: "unsatisfied", label: "Insatisfait", score: 0.5 },
      { value: "very-unsatisfied", label: "Très insatisfait", score: 0 },
    ],
  },
  {
    id: "sleep-type",
    text: "Somnotype",
    options: [
      { value: "short", label: "Petit(e) dormeur(se)", score: 1 },
      { value: "long", label: "Long(ue) dormeur(se)", score: 1 },
      { value: "neither", label: "Ni l'un ni l'autre", score: 1 },
    ],
  },
  {
    id: "daytime-sleepiness",
    text: "Vous sentez-vous somnolent(e) au cours de la journée ?",
    options: [
      { value: "none", label: "Aucunement", score: 2 },
      { value: "slightly", label: "Légèrement", score: 1.5 },
      { value: "moderately", label: "Moyennement", score: 1 },
      { value: "much", label: "Beaucoup", score: 0.5 },
      { value: "very-much", label: "Énormément", score: 0 },
    ],
  },
  {
    id: "apnea",
    text: "Votre entourage a-t-il remarqué que vous ronflez fort, arrêtez de respirer pendant votre sommeil ?",
    options: [
      { value: "yes", label: "Oui", score: 0 },
      { value: "no", label: "Non", score: 2 },
      { value: "unknown", label: "Je ne sais pas", score: 1 },
    ],
  },
];
