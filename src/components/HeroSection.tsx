import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-foreground/10 backdrop-blur-sm border border-accent-foreground/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent-foreground/90">
              Propulsé par l'Intelligence Artificielle
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6 animate-slide-up">
            Créez le CV parfait
            <br />
            <span className="text-accent">optimisé pour chaque offre</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up stagger-1">
            Notre IA analyse votre profil et l'offre d'emploi pour générer un CV 
            sur-mesure qui maximise vos chances de décrocher l'entretien.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up stagger-2">
            <Button variant="hero" size="xl">
              Créer mon CV gratuitement
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-outline" size="xl">
              Voir les modèles
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up stagger-3">
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-primary-foreground">87%</div>
                <div className="text-sm text-primary-foreground/70">Taux de réponse</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-primary-foreground">5 min</div>
                <div className="text-sm text-primary-foreground/70">Pour créer un CV</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-primary-foreground">50K+</div>
                <div className="text-sm text-primary-foreground/70">CV générés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
