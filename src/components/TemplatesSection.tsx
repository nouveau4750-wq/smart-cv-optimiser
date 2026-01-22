import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Zap } from "lucide-react";

const templates = [
  {
    name: "Élite",
    description: "Design premium avec accents dorés et typographie raffinée pour les postes de direction.",
    icon: Crown,
    gradient: "from-amber-500 via-yellow-400 to-amber-600",
    accentColor: "bg-amber-500",
    features: ["Header signature", "Timeline élégante", "Accents premium"],
  },
  {
    name: "Néon",
    description: "Style futuriste et audacieux, parfait pour les secteurs tech et startups innovantes.",
    icon: Zap,
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    accentColor: "bg-violet-500",
    features: ["Gradient dynamique", "Layout asymétrique", "Style cutting-edge"],
    popular: true,
  },
  {
    name: "Cristal",
    description: "Minimalisme épuré avec effets glassmorphism pour un look ultra-contemporain.",
    icon: Sparkles,
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    accentColor: "bg-cyan-500",
    features: ["Effet verre dépoli", "Ombres subtiles", "Espacement parfait"],
  },
];

const TemplatesSection = () => {
  return (
    <section id="templates" className="py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Collection Premium
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Templates{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              nouvelle génération
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Des designs exclusifs créés par des experts, optimisés pour captiver les recruteurs et passer tous les filtres ATS.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template, index) => (
            <div
              key={index}
              className={`group relative rounded-3xl bg-card/80 backdrop-blur-sm border-2 ${
                template.popular 
                  ? "border-accent shadow-[0_0_40px_-10px] shadow-accent/30" 
                  : "border-border/50 hover:border-primary/30"
              } overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
            >
              {/* Popular Badge */}
              {template.popular && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent to-primary text-primary-foreground text-xs font-bold shadow-lg">
                  <Zap className="w-3 h-3" />
                  Tendance
                </div>
              )}

              {/* Template Preview - Ultra Modern CV */}
              <div className="relative h-80 p-8 flex items-center justify-center bg-gradient-to-br from-muted/50 via-background to-muted/30 overflow-hidden">
                {/* Decorative Elements */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${template.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${template.gradient} opacity-5 blur-xl`} />
                
                {/* CV Preview Card */}
                <div className="relative w-full max-w-[180px] aspect-[3/4] bg-card rounded-xl shadow-2xl overflow-hidden border border-border/30 transform group-hover:scale-105 transition-transform duration-500">
                  {/* CV Header with Gradient */}
                  <div className={`h-16 bg-gradient-to-r ${template.gradient} relative overflow-hidden`}>
                    {/* Photo Placeholder */}
                    <div className="absolute -bottom-4 left-4 w-10 h-10 rounded-full bg-card border-2 border-card shadow-lg flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20" />
                    </div>
                    {/* Decorative Lines */}
                    <div className="absolute top-3 right-3 space-y-1">
                      <div className="h-1 w-12 bg-white/30 rounded-full" />
                      <div className="h-1 w-8 bg-white/20 rounded-full" />
                    </div>
                  </div>
                  
                  {/* CV Content */}
                  <div className="p-4 pt-8 space-y-3">
                    {/* Name */}
                    <div className="space-y-1">
                      <div className="h-2.5 w-20 bg-foreground/80 rounded-full" />
                      <div className="h-1.5 w-14 bg-muted-foreground/40 rounded-full" />
                    </div>
                    
                    {/* Section with accent */}
                    <div className="space-y-1.5 pt-2">
                      <div className={`h-1.5 w-10 ${template.accentColor} rounded-full opacity-80`} />
                      <div className="h-1 w-full bg-muted rounded-full" />
                      <div className="h-1 w-4/5 bg-muted rounded-full" />
                      <div className="h-1 w-3/5 bg-muted rounded-full" />
                    </div>
                    
                    {/* Skills Pills */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      <div className={`h-2 w-8 ${template.accentColor} rounded-full opacity-20`} />
                      <div className={`h-2 w-6 ${template.accentColor} rounded-full opacity-20`} />
                      <div className={`h-2 w-10 ${template.accentColor} rounded-full opacity-20`} />
                    </div>
                    
                    {/* Timeline */}
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-2">
                        <div className={`w-1.5 h-8 ${template.accentColor} rounded-full opacity-60`} />
                        <div className="flex-1 space-y-1">
                          <div className="h-1 w-full bg-muted rounded-full" />
                          <div className="h-1 w-3/4 bg-muted/60 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className={`absolute top-6 left-6 w-8 h-8 rounded-lg bg-gradient-to-br ${template.gradient} opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-700`} />
                <div className={`absolute bottom-8 right-6 w-6 h-6 rounded-full bg-gradient-to-br ${template.gradient} opacity-15 group-hover:scale-150 transition-transform duration-500`} />
              </div>

              {/* Template Info */}
              <div className="p-6 border-t border-border/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${template.gradient} shadow-lg`}>
                    <template.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {template.name}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  {template.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {template.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${template.gradient} flex items-center justify-center shadow-sm`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={template.popular ? "default" : "outline"}
                  className={`w-full h-12 font-semibold text-sm rounded-xl transition-all duration-300 ${
                    template.popular 
                      ? "bg-gradient-to-r from-accent to-primary hover:opacity-90 shadow-lg shadow-accent/20" 
                      : "hover:bg-primary/5 hover:border-primary/50"
                  }`}
                >
                  Utiliser ce template
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Tous nos templates sont <span className="text-primary font-medium">100% compatibles ATS</span> et testés par des recruteurs
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/70">
            <Check className="w-4 h-4 text-accent" />
            <span>Export PDF haute qualité</span>
            <span className="mx-2">•</span>
            <Check className="w-4 h-4 text-accent" />
            <span>Personnalisation illimitée</span>
            <span className="mx-2">•</span>
            <Check className="w-4 h-4 text-accent" />
            <span>Mises à jour gratuites</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
