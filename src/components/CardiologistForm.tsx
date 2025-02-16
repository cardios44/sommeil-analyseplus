
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cardiologistQuestions, PatientBasicInfo } from "@/data/cardiologistQuestions";
import { useToast } from "@/components/ui/use-toast";

interface CardiologistFormProps {
  onComplete: (data: any) => void;
  patientId: string;
}

const CardiologistForm = ({ onComplete, patientId }: CardiologistFormProps) => {
  const [basicInfo, setBasicInfo] = useState<PatientBasicInfo>({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "male",
    height: 0,
    weight: 0,
    bmi: 0,
    consultationReason: "",
  });

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const [otherCardiovascular, setOtherCardiovascular] = useState("");
  const { toast } = useToast();

  const calculateBMI = (height: number, weight: number) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      return Math.round(bmi * 10) / 10;
    }
    return 0;
  };

  const handleBasicInfoChange = (field: keyof PatientBasicInfo, value: string | number) => {
    setBasicInfo((prev) => {
      const newInfo = { ...prev, [field]: value };
      if (field === "height" || field === "weight") {
        newInfo.bmi = calculateBMI(
          field === "height" ? Number(value) : prev.height,
          field === "weight" ? Number(value) : prev.weight
        );
      }
      return newInfo;
    });
  };

  const handleCheckboxChange = (questionId: string, optionValue: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, optionValue] };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((value) => value !== optionValue),
        };
      }
    });
  };

  const handleSubmit = () => {
    if (!basicInfo.firstName || !basicInfo.lastName || !basicInfo.birthDate) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      patientId,
      basicInfo,
      answers,
      otherSymptoms,
      otherCardiovascular,
      timestamp: new Date().toISOString(),
    };

    onComplete(formData);
  };

  return (
    <div className="form-container max-w-3xl mx-auto p-4">
      <Card className="p-6 space-y-8">
        <h2 className="text-2xl font-bold text-primary">Évaluation Cardiologique</h2>

        {/* Informations de base */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Informations du patient</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nom</Label>
              <Input
                id="firstName"
                value={basicInfo.firstName}
                onChange={(e) => handleBasicInfoChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Prénom</Label>
              <Input
                id="lastName"
                value={basicInfo.lastName}
                onChange={(e) => handleBasicInfoChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              type="date"
              value={basicInfo.birthDate}
              onChange={(e) => handleBasicInfoChange("birthDate", e.target.value)}
            />
          </div>

          <div>
            <Label>Sexe</Label>
            <RadioGroup
              value={basicInfo.gender}
              onValueChange={(value: "male" | "female") =>
                handleBasicInfoChange("gender", value)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Homme</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Femme</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                value={basicInfo.height || ""}
                onChange={(e) => handleBasicInfoChange("height", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={basicInfo.weight || ""}
                onChange={(e) => handleBasicInfoChange("weight", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>IMC</Label>
              <Input value={basicInfo.bmi || ""} disabled />
            </div>
          </div>

          <div>
            <Label htmlFor="consultationReason">Motif de consultation</Label>
            <Input
              id="consultationReason"
              value={basicInfo.consultationReason}
              onChange={(e) => handleBasicInfoChange("consultationReason", e.target.value)}
            />
          </div>
        </div>

        {/* Questions avec checkboxes */}
        {cardiologistQuestions.map((question) => (
          <div key={question.id} className="space-y-4">
            <h3 className="text-xl font-semibold">{question.text}</h3>
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option.value}`}
                    checked={
                      (answers[question.id] || []).includes(option.value)
                    }
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(question.id, option.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`${question.id}-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {question.id === "current-symptoms" && (
              <div>
                <Label>Autres symptômes</Label>
                <Input
                  value={otherSymptoms}
                  onChange={(e) => setOtherSymptoms(e.target.value)}
                  placeholder="Précisez les autres symptômes"
                />
              </div>
            )}
            {question.id === "cardiovascular-history" && (
              <div>
                <Label>Autres antécédents</Label>
                <Input
                  value={otherCardiovascular}
                  onChange={(e) => setOtherCardiovascular(e.target.value)}
                  placeholder="Précisez les autres antécédents"
                />
              </div>
            )}
          </div>
        ))}

        <Button onClick={handleSubmit} className="w-full">
          Valider l'évaluation cardiologique
        </Button>
      </Card>
    </div>
  );
};

export default CardiologistForm;
