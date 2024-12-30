import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConsentPageProps {
  onAccept: () => void;
}

const ConsentPage = ({ onAccept }: ConsentPageProps) => {
  return (
    <div className="form-container">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Étude sur le Sommeil en Cardiologie
        </h1>
        
        <div className="space-y-4 text-gray-700">
          <p className="font-medium text-lg">
            Bienvenue dans notre étude sur le sommeil en cardiologie
          </p>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">Objectif de l'étude</h2>
            <p>
              Cette étude vise à mieux comprendre les habitudes de sommeil des patients
              en cardiologie pour améliorer leur prise en charge.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">Protection des données</h2>
            <p>
              Vos données seront traitées de manière confidentielle et sécurisée,
              conformément au RGPD. Elles seront utilisées uniquement à des fins de recherche.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">Participation volontaire</h2>
            <p>
              Votre participation est entièrement volontaire. Vous pouvez vous retirer
              de l'étude à tout moment sans justification.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Button onClick={onAccept} className="w-full">
            J'accepte de participer à l'étude
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConsentPage;