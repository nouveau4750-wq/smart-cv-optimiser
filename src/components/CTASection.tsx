import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      
      {/* Decorative blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-foreground/10 backdrop-blur-sm border border-accent-foreground/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent-foreground/90">
              Gratuit pour commencer
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Prêt à décrocher votre prochain emploi ?
          </h2>
          
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Créez un CV optimisé pour l'IA en quelques minutes. 
            Rejoignez les 50 000+ professionnels qui ont boosté leur carrière.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Créer mon CV maintenant
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-outline" size="lg">
              Voir une démo
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/60 text-sm">
            <span>✓ Aucune carte requise</span>
            <span>✓ Export PDF gratuit</span>
            <span>✓ Support FR/EN</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
