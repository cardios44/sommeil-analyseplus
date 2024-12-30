import { useState } from "react";
import ConsentPage from "@/components/ConsentPage";
import SleepQuestionnaire from "@/components/SleepQuestionnaire";
import ResultsView from "@/components/ResultsView";

const Index = () => {
  const [step, setStep] = useState<"consent" | "questionnaire" | "results">("consent");
  const [results, setResults] = useState<any>(null);

  const handleConsent = () => {
    setStep("questionnaire");
  };

  const handleQuestionnaireComplete = (questionnaireResults: any) => {
    setResults(questionnaireResults);
    setStep("results");
  };

  return (
    <div className="min-h-screen bg-background py-8">
      {step === "consent" && <ConsentPage onAccept={handleConsent} />}
      {step === "questionnaire" && (
        <SleepQuestionnaire onComplete={handleQuestionnaireComplete} />
      )}
      {step === "results" && <ResultsView scores={results.scores} />}
    </div>
  );
};

export default Index;