
import { Card } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { questions } from "@/data/questions";

interface ResultsViewProps {
  scores: {
    dimensions: Record<string, number>;
    total: number;
  };
  answers: Record<string, string>;
  consultationReason: string;
}

const dimensionLabels: Record<string, string> = {
  duration: "Durée",
  regularity: "Régularité",
  chronotype: "Chronotype",
  insomnia: "Insomnie",
  satisfaction: "Satisfaction",
  "sleep-type": "Somnotype",
  sleepiness: "Somnolence",
  apnea: "Apnées",
};

const ResultsView = ({ scores, answers, consultationReason }: ResultsViewProps) => {
  // Vérifier si scores.dimensions existe avant de créer chartData
  const chartData = scores?.dimensions ? Object.entries(scores.dimensions).map(([key, value]) => ({
    dimension: dimensionLabels[key] || key,
    score: value,
  })) : [];

  const totalScore = scores?.total || 0;
  const maxPossibleScore = 18;
  const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);

  return (
    <div className="form-container max-w-3xl mx-auto p-4 space-y-8">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Résultats de votre évaluation du sommeil
        </h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Motif de consultation</h3>
          <p className="text-gray-700">{consultationReason || "Non spécifié"}</p>
        </div>

        <Separator className="my-6" />

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Score global</h3>
          <div className="text-4xl font-bold text-primary">
            {scorePercentage}%
          </div>
          <p className="text-gray-600 mt-2">
            Score total : {totalScore}/{maxPossibleScore} points
          </p>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" />
              <PolarRadiusAxis domain={[0, 3]} />
              <Radar
                name="Scores"
                dataKey="score"
                stroke="#1a237e"
                fill="#bbdefb"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <Separator className="my-6" />

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Détail des réponses</h3>
          <div className="space-y-4">
            {answers && Object.entries(answers).map(([questionId, answer]) => {
              const question = questions.find(q => q.id === questionId);
              const option = question?.options.find(opt => opt.value === answer);
              
              if (question && option) {
                return (
                  <div key={questionId} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{question.text}</p>
                    <p className="text-gray-700 mt-1">Réponse : {option.label}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recommandations</h3>
          <div className="space-y-4">
            {scores?.dimensions && Object.entries(scores.dimensions).map(([key, score]) => {
              let recommendation = "";
              if (score <= 1) {
                switch (key) {
                  case "duration":
                    recommendation = "Essayez d'augmenter votre temps de sommeil pour atteindre 7-8h par nuit.";
                    break;
                  case "regularity":
                    recommendation = "Maintenez des horaires de sommeil plus réguliers.";
                    break;
                  case "chronotype":
                    recommendation = "Adaptez vos horaires à votre chronotype naturel quand possible.";
                    break;
                  case "insomnia":
                    recommendation = "Consultez un spécialiste pour vos problèmes d'insomnie.";
                    break;
                  case "sleepiness":
                    recommendation = "Votre somnolence diurne mérite une attention médicale.";
                    break;
                  case "apnea":
                    recommendation = "Un dépistage des apnées du sommeil serait recommandé.";
                    break;
                }
                return recommendation ? (
                  <p key={key} className="text-gray-700">
                    <span className="font-semibold">{dimensionLabels[key]}</span>:{" "}
                    {recommendation}
                  </p>
                ) : null;
              }
              return null;
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsView;
