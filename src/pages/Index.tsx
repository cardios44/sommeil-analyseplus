import { useState } from "react";
import ConsentPage from "@/components/ConsentPage";
import SleepQuestionnaire from "@/components/SleepQuestionnaire";
import ResultsView from "@/components/ResultsView";
import CardiologistForm from "@/components/CardiologistForm";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

interface PatientData {
  patientId: string;
  cardiologistData?: {
    basicInfo: {
      firstName: string;
      lastName: string;
      birthDate: string;
      gender: string;
      height: number;
      weight: number;
      bmi: number;
      consultationReason: string;
    };
    answers: Record<string, string[]>;
    otherSymptoms?: string;
    otherCardiovascular?: string;
  };
  sleepData?: any;
  timestamp: string;
}

const Index = () => {
  const [step, setStep] = useState<"consent" | "cardio" | "questionnaire" | "results">("consent");
  const [currentPatientId, setCurrentPatientId] = useState<string>("");
  const [patientDataList, setPatientDataList] = useState<PatientData[]>([]);
  const [currentResults, setCurrentResults] = useState<any>(null);
  const { toast } = useToast();

  const handleConsent = () => {
    const newPatientId = `P${patientDataList.length + 1}`;
    setCurrentPatientId(newPatientId);
    setStep("cardio");
  };

  const handleCardiologistComplete = (cardiologistData: any) => {
    setPatientDataList((prev) => [
      ...prev,
      {
        patientId: currentPatientId,
        cardiologistData,
        timestamp: new Date().toISOString(),
      },
    ]);
    setStep("questionnaire");
  };

  const handleQuestionnaireComplete = (sleepData: any) => {
    setCurrentResults(sleepData);
    setPatientDataList((prev) =>
      prev.map((p) =>
        p.patientId === currentPatientId
          ? { ...p, sleepData }
          : p
      )
    );
    setStep("results");
  };

  const exportAllData = () => {
    try {
      const wb = XLSX.utils.book_new();

      const allData = patientDataList.map((patient) => {
        const currentSymptoms = patient.cardiologistData?.answers['current-symptoms'] || [];
        const cardiovascularHistory = patient.cardiologistData?.answers['cardiovascular-history'] || [];
        const riskFactors = patient.cardiologistData?.answers['risk-factors'] || [];

        return {
          'ID Patient': patient.patientId,
          'Date': new Date(patient.timestamp).toLocaleDateString(),
          'Nom': patient.cardiologistData?.basicInfo?.firstName,
          'Prénom': patient.cardiologistData?.basicInfo?.lastName,
          'Date de naissance': patient.cardiologistData?.basicInfo?.birthDate,
          'Sexe': patient.cardiologistData?.basicInfo?.gender === 'male' ? 'Homme' : 'Femme',
          'Taille (cm)': patient.cardiologistData?.basicInfo?.height,
          'Poids (kg)': patient.cardiologistData?.basicInfo?.weight,
          'IMC': patient.cardiologistData?.basicInfo?.bmi,
          'Motif de consultation': patient.cardiologistData?.basicInfo?.consultationReason,
          'Symptômes': currentSymptoms.join(', '),
          'Autres symptômes': patient.cardiologistData?.otherSymptoms,
          'Antécédents cardiovasculaires': cardiovascularHistory.join(', '),
          'Autres antécédents': patient.cardiologistData?.otherCardiovascular,
          'Facteurs de risque': riskFactors.join(', '),
          'Score Sommeil Total': patient.sleepData?.scores?.total,
        };
      });

      const ws = XLSX.utils.json_to_sheet(allData);
      XLSX.utils.book_append_sheet(wb, ws, 'Données Patients');

      XLSX.writeFile(wb, `données-patients-${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      {patientDataList.length > 0 && (
        <div className="max-w-3xl mx-auto mb-8 flex justify-end">
          <Button onClick={exportAllData}>
            Exporter toutes les données ({patientDataList.length} patients)
          </Button>
        </div>
      )}

      {step === "consent" && <ConsentPage onAccept={handleConsent} />}
      {step === "cardio" && (
        <CardiologistForm
          onComplete={handleCardiologistComplete}
          patientId={currentPatientId}
        />
      )}
      {step === "questionnaire" && (
        <SleepQuestionnaire onComplete={handleQuestionnaireComplete} />
      )}
      {step === "results" && currentResults && (
        <>
          <ResultsView
            scores={currentResults.scores}
            answers={currentResults.answers}
            consultationReason={currentResults.consultationReason}
          />
          <div className="max-w-3xl mx-auto mt-8">
            <Button
              onClick={() => setStep("consent")}
              className="w-full"
            >
              Nouveau Patient
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
