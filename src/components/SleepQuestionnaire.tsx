
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { questions } from "@/data/questions";

interface SleepQuestionnaireProps {
  onComplete: (results: any) => void;
}

const SleepQuestionnaire = ({ onComplete }: SleepQuestionnaireProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consultationReason, setConsultationReason] = useState("");
  const [startTime] = useState(new Date());
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

    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    const scores = calculateScores();
    const results = {
      answers,
      consultationReason,
      scores,
      completionTime: {
        minutes,
        seconds,
        totalSeconds: durationInSeconds
      },
      timestamp: new Date().toISOString(),
    };

    toast({
      title: "Questionnaire complété",
      description: `Temps de remplissage : ${minutes} minutes et ${seconds} secondes`,
    });

    onComplete(results);
  };

  return (
    <div className="form-container max-w-3xl mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Questionnaire de Consultation
      </h1>

      <Card className="consultation-reason p-6 bg-primary/5">
        <h2 className="text-xl font-semibold mb-4">Motif de la consultation</h2>
        <Textarea
          placeholder="Veuillez indiquer le motif de votre consultation..."
          value={consultationReason}
          onChange={(e) => setConsultationReason(e.target.value)}
          className="min-h-[100px]"
        />
      </Card>

      <div className="space-y-2">
        <Separator className="my-8" />
        <h2 className="text-2xl font-semibold mb-6">Questionnaire sur le Sommeil</h2>
      </div>

      <div className="space-y-6">
        {questions.map((question) => (
          <Card key={question.id} className="p-6">
            <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
            <RadioGroup
              onValueChange={(value) => handleAnswer(question.id, value)}
              value={answers[question.id]}
            >
              <div className="grid gap-4">
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                    <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} className="w-full mt-8">
        Soumettre mes réponses
      </Button>
    </div>
  );
};

export default SleepQuestionnaire;
