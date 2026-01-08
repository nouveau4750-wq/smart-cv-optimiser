import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const templates = [
  {
    name: "Modern",
    description: "Design épuré et contemporain, idéal pour les secteurs tech et créatifs.",
    color: "bg-primary",
    features: ["En-tête avec photo", "Barres de compétences", "Timeline expériences"],
  },
  {
    name: "Classic",
    description: "Format traditionnel et élégant, parfait pour les secteurs corporate.",
    color: "bg-accent",
    features: ["Layout deux colonnes", "Style sobre", "Sections bien définies"],
    popular: true,
  },
  {
    name: "Minimal",
    description: "Simplicité et efficacité, met en valeur le contenu avant tout.",
    color: "bg-muted-foreground",
    features: ["Design minimaliste", "Typographie élégante", "Espacement aéré"],
  },
];

const TemplatesSection = () => {
  return (
    <section id="templates" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Modèles
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Des designs qui font la différence
          </h2>
          <p className="text-muted-foreground text-lg">
            Choisissez parmi nos modèles professionnels, tous optimisés pour passer les filtres ATS.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {templates.map((template, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl bg-card border-2 ${
                template.popular ? "border-accent" : "border-border"
              } overflow-hidden card-elevated`}
            >
              {/* Popular Badge */}
              {template.popular && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold z-10">
                  Populaire
                </div>
              )}

              {/* Template Preview */}
              <div className="h-64 p-6 flex items-center justify-center bg-gradient-to-br from-muted to-background">
                <div className="w-full max-w-[160px] bg-card rounded-lg shadow-lg overflow-hidden border border-border">
                  {/* Mini CV Preview */}
                  <div className={`h-8 ${template.color}`} />
                  <div className="p-3 space-y-2">
                    <div className="h-2 w-3/4 bg-muted rounded" />
                    <div className="h-1.5 w-1/2 bg-muted/60 rounded" />
                    <div className="pt-2 space-y-1">
                      <div className="h-1 w-full bg-muted/40 rounded" />
                      <div className="h-1 w-5/6 bg-muted/40 rounded" />
                      <div className="h-1 w-4/6 bg-muted/40 rounded" />
                    </div>
                    <div className="pt-2 space-y-1">
                      <div className="h-1 w-full bg-muted/40 rounded" />
                      <div className="h-1 w-3/4 bg-muted/40 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {template.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {template.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={template.popular ? "accent" : "outline"}
                  className="w-full"
                >
                  Utiliser ce modèle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
