
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cardiologistQuestions } from "@/data/cardiologistQuestions";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CardiologistFormProps {
  onComplete: (data: any) => void;
  patientId: string;
}

const CardiologistForm = ({ onComplete, patientId }: CardiologistFormProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < cardiologistQuestions.length) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez répondre à toutes les questions",
        variant: "destructive",
      });
      return;
    }

    const cardiologistData = {
      patientId,
      answers,
      notes,
      timestamp: new Date().toISOString(),
    };

    onComplete(cardiologistData);
  };

  return (
    <div className="form-container max-w-3xl mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Évaluation Cardiologique
        </h2>

        <div className="space-y-6">
          {cardiologistQuestions.map((question) => (
            <div key={question.id} className="space-y-4">
              <h3 className="text-lg font-semibold">{question.text}</h3>
              <RadioGroup
                onValueChange={(value) => handleAnswer(question.id, value)}
                value={answers[question.id]}
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                    <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos observations..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Valider l'évaluation cardiologique
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CardiologistForm;
