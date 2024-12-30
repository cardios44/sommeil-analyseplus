import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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
    text: "Quelle est votre durée moyenne de sommeil par nuit ?",
    options: [
      { value: "less-6", label: "Moins de 6h", score: 0 },
      { value: "6-7", label: "6-7h", score: 1 },
      { value: "7-8", label: "7-8h", score: 2 },
      { value: "more-8", label: "Plus de 8h", score: 1 },
    ],
  },
  {
    id: "regularity",
    text: "Vos horaires de sommeil sont-ils réguliers ?",
    options: [
      { value: "very-irregular", label: "Très irréguliers", score: 0 },
      { value: "somewhat-irregular", label: "Plutôt irréguliers", score: 1 },
      { value: "somewhat-regular", label: "Plutôt réguliers", score: 2 },
      { value: "very-regular", label: "Très réguliers", score: 3 },
    ],
  },
  {
    id: "chronotype",
    text: "Quel est votre chronotype (préférence naturelle pour le matin ou le soir) ?",
    options: [
      { value: "extreme-evening", label: "Extrême soir", score: 0 },
      { value: "evening", label: "Soir", score: 1 },
      { value: "morning", label: "Matin", score: 2 },
      { value: "extreme-morning", label: "Extrême matin", score: 1 },
    ],
  },
  {
    id: "insomnia",
    text: "Souffrez-vous d'insomnie ?",
    options: [
      { value: "never", label: "Jamais", score: 3 },
      { value: "rarely", label: "Rarement", score: 2 },
      { value: "often", label: "Souvent", score: 1 },
      { value: "very-often", label: "Très souvent", score: 0 },
    ],
  },
  {
    id: "sleepiness",
    text: "Ressentez-vous une somnolence diurne excessive ?",
    options: [
      { value: "never", label: "Jamais", score: 3 },
      { value: "rarely", label: "Rarement", score: 2 },
      { value: "often", label: "Souvent", score: 1 },
      { value: "very-often", label: "Très souvent", score: 0 },
    ],
  },
  {
    id: "apnea",
    text: "Suspectez-vous des apnées du sommeil ?",
    options: [
      { value: "no", label: "Non", score: 3 },
      { value: "not-sure", label: "Je ne sais pas", score: 2 },
      { value: "maybe", label: "Peut-être", score: 1 },
      { value: "yes", label: "Oui", score: 0 },
    ],
  },
];

interface SleepQuestionnaireProps {
  onComplete: (results: any) => void;
}

const SleepQuestionnaire = ({ onComplete }: SleepQuestionnaireProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
    if (Object.keys(answers).length < questions.length) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez répondre à toutes les questions",
        variant: "destructive",
      });
      return;
    }

    const scores = calculateScores();
    const results = {
      answers,
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

      <Button onClick={handleSubmit} className="w-full mt-6">
        Soumettre mes réponses
      </Button>
    </div>
  );
};

export default SleepQuestionnaire;