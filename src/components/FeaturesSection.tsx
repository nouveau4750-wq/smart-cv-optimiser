import { Brain, FileCheck, Globe, Layers, Target, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Optimisation IA",
    description: "Notre IA analyse les offres d'emploi et suggère les mots-clés et phrases impactantes pour maximiser votre score ATS.",
  },
  {
    icon: Target,
    title: "Score de compatibilité",
    description: "Obtenez un score précis de l'adéquation entre votre CV et chaque offre d'emploi avec des recommandations personnalisées.",
  },
  {
    icon: Layers,
    title: "Modèles professionnels",
    description: "Choisissez parmi nos modèles élégants et modernes, tous optimisés pour les systèmes ATS des recruteurs.",
  },
  {
    icon: FileCheck,
    title: "Export multi-format",
    description: "Exportez votre CV en PDF, DOCX ou JSON ATS-friendly. Compatible avec tous les systèmes de recrutement.",
  },
  {
    icon: Globe,
    title: "CV Web interactif",
    description: "Partagez votre CV via un lien unique avec une version web interactive et professionnelle.",
  },
  {
    icon: Zap,
    title: "Création rapide",
    description: "Créez un CV optimisé en moins de 5 minutes grâce à notre interface intuitive et nos suggestions automatiques.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Tout ce qu'il faut pour décrocher l'entretien
          </h2>
          <p className="text-muted-foreground text-lg">
            Des outils puissants propulsés par l'IA pour créer le CV parfait et vous démarquer des autres candidats.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border card-elevated"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
