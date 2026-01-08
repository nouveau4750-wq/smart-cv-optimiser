import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";

const ScoringSection = () => {
  const [score] = useState(78);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const recommendations = [
    { type: "success", text: "Compétences techniques bien alignées avec l'offre" },
    { type: "warning", text: "Ajoutez des résultats chiffrés à vos expériences" },
    { type: "warning", text: "Mentionnez 'gestion de projet' - mot-clé important" },
    { type: "info", text: "Conseil: Ajoutez une section certifications" },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Description */}
          <div>
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Scoring intelligent
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Mesurez l'adéquation de votre CV
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Notre algorithme analyse votre CV par rapport à l'offre d'emploi et vous donne un score précis avec des recommandations personnalisées pour l'améliorer.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Score ATS</h4>
                  <p className="text-sm text-muted-foreground">
                    Compatibilité avec les systèmes de suivi des candidatures
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Score Impact</h4>
                  <p className="text-sm text-muted-foreground">
                    Qualité des phrases d'action et résultats mesurables
                  </p>
                </div>
              </div>
            </div>

            <Button variant="default" size="lg">
              Analyser mon CV
            </Button>
          </div>

          {/* Right: Score Preview */}
          <div className="relative">
            <div className="rounded-2xl bg-card border border-border p-8 card-elevated">
              {/* Score Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                  {/* Background Circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="hsl(var(--accent))"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(score / 100) * 553} 553`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  {/* Score Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Compatibilité
                    </span>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-xl font-bold text-foreground">82%</div>
                  <div className="text-xs text-muted-foreground">ATS</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-xl font-bold text-foreground">75%</div>
                  <div className="text-xs text-muted-foreground">Impact</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-xl font-bold text-foreground">70%</div>
                  <div className="text-xs text-muted-foreground">Soft Skills</div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Recommandations</h4>
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      rec.type === "success"
                        ? "bg-success/10"
                        : rec.type === "warning"
                        ? "bg-warning/10"
                        : "bg-accent/10"
                    }`}
                  >
                    {rec.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    ) : rec.type === "warning" ? (
                      <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm text-foreground">{rec.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 blur-3xl rounded-full opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScoringSection;
