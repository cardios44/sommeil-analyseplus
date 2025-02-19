
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { questions } from "@/data/questions";

interface SleepQuestionnaireProps {
  onComplete: (results: any) => void;
}

const SleepQuestionnaire = ({ onComplete }: SleepQuestionnaireProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState({ minutes: 0, seconds: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const durationInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime({
        minutes: Math.floor(durationInSeconds / 60),
        seconds: durationInSeconds % 60
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

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

    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    const scores = calculateScores();
    const results = {
      answers,
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Questionnaire Sommeil
        </h1>
        <Card className="p-4 bg-primary/5">
          <span className="font-mono text-lg">
            {String(elapsedTime.minutes).padStart(2, '0')}:{String(elapsedTime.seconds).padStart(2, '0')}
          </span>
        </Card>
      </div>

      <Separator className="my-8" />

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
