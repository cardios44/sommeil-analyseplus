
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface QuestionOption {
  value: string;
  label: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

const questions: Question[] = [
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
      { value: "neutral", label: "Sans préférence", score: 2 },
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
    text: "Quel est votre somnotype ?",
    options: [
      { value: "short", label: "Petite dormeuse", score: 1 },
      { value: "long", label: "Longue dormeuse", score: 1 },
    ],
  },
  {
    id: "sleepiness",
    text: "Ressentez-vous une somnolence ou une fatigue excessive pendant la journée, même après une nuit de sommeil ?",
    options: [
      { value: "frequently", label: "Oui, fréquemment", score: 0 },
      { value: "sometimes", label: "Parfois", score: 1 },
      { value: "rarely", label: "Rarement ou jamais", score: 2 },
    ],
  },
  {
    id: "apnea",
    text: "Votre entourage a-t-il remarqué que vous ronflez fort, arrêtez de respirer ou bougez beaucoup pendant votre sommeil ?",
    options: [
      { value: "yes", label: "Oui", score: 0 },
      { value: "no", label: "Non", score: 2 },
      { value: "unknown", label: "Je ne sais pas", score: 1 },
    ],
  },
];

interface SleepQuestionnaireProps {
  onComplete: (results: any) => void;
}

const SleepQuestionnaire = ({ onComplete }: SleepQuestionnaireProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consultationReason, setConsultationReason] = useState("");
  const { toast } = useToast();

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const calculateScores = () => {
    const scores = {
      total: 0,
      dimensions: {} as Record<string, number>,
    };

    questions.forEach((question) => {
      const answer = answers[question.id];
      const option = question.options.find((opt) => opt.value === answer);
      if (option) {
        scores.dimensions[question.id] = option.score;
        scores.total += option.score;
      }
    });

    return scores;
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length || !consultationReason.trim()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez répondre à toutes les questions et indiquer le motif de consultation",
        variant: "destructive",
      });
      return;
    }

    const scores = calculateScores();
    const results = {
      answers,
      consultationReason,
      scores,
      timestamp: new Date().toISOString(),
    };

    onComplete(results);
  };

  return (
    <div className="form-container">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Questionnaire sur le Sommeil
      </h1>

      {questions.map((question) => (
        <Card key={question.id} className="question-card">
          <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
          <RadioGroup
            onValueChange={(value) => handleAnswer(question.id, value)}
            value={answers[question.id]}
          >
            <div className="radio-group">
              {question.options.map((option) => (
                <div key={option.value} className="radio-option">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </Card>
      ))}

      <Card className="question-card">
        <h2 className="text-xl font-semibold mb-4">Motif de la consultation</h2>
        <Textarea
          placeholder="Veuillez indiquer le motif de votre consultation..."
          value={consultationReason}
          onChange={(e) => setConsultationReason(e.target.value)}
          className="min-h-[100px]"
        />
      </Card>

      <Button onClick={handleSubmit} className="w-full mt-6">
        Soumettre mes réponses
      </Button>
    </div>
  );
};

export default SleepQuestionnaire;
