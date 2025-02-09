
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
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { questions } from "@/data/questions";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  const chartData = scores?.dimensions ? Object.entries(scores.dimensions).map(([key, value]) => ({
    dimension: dimensionLabels[key] || key,
    score: value,
  })) : [];

  const totalScore = scores?.total || 0;
  const maxPossibleScore = 18;
  const scorePercentage = Math.round((totalScore / maxPossibleScore) * 100);

  const exportToExcel = () => {
    try {
      // Création des données pour l'export
      const exportData = {
        'Informations Générales': [{
          'Date': new Date().toLocaleDateString(),
          'Motif de consultation': consultationReason || "Non spécifié",
          'Score Total': `${totalScore}/${maxPossibleScore}`,
          'Pourcentage': `${scorePercentage}%`
        }],
        'Scores par Dimension': Object.entries(scores?.dimensions || {}).map(([key, value]) => ({
          'Dimension': dimensionLabels[key] || key,
          'Score': value
        })),
        'Réponses Détaillées': Object.entries(answers || {}).map(([questionId, answer]) => {
          const question = questions.find(q => q.id === questionId);
          const option = question?.options.find(opt => opt.value === answer);
          return {
            'Question': question?.text || questionId,
            'Réponse': option?.label || answer
          };
        })
      };

      // Création du classeur Excel
      const wb = XLSX.utils.book_new();

      // Ajout des feuilles
      Object.entries(exportData).forEach(([sheetName, data]) => {
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      // Génération et téléchargement du fichier
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `evaluation-sommeil-${date}.xlsx`);

      toast({
        title: "Export réussi",
        description: "Le fichier Excel a été généré avec succès",
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
    <div className="form-container max-w-3xl mx-auto p-4 space-y-8">
      <Card className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Résultats de votre évaluation du sommeil
          </h2>
          <Button 
            onClick={exportToExcel}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter en Excel
          </Button>
        </div>

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
