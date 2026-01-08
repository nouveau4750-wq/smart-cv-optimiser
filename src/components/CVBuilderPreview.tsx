import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Download, Eye, GraduationCap, Plus, User, Wrench } from "lucide-react";
import { useState } from "react";

const CVBuilderPreview = () => {
  const [activeSection, setActiveSection] = useState("personal");

  const sections = [
    { id: "personal", label: "Informations", icon: User },
    { id: "experience", label: "Expérience", icon: Briefcase },
    { id: "education", label: "Formation", icon: GraduationCap },
    { id: "skills", label: "Compétences", icon: Wrench },
  ];

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Éditeur de CV
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Créez votre CV en quelques minutes
          </h2>
          <p className="text-muted-foreground text-lg">
            Interface intuitive pour construire un CV professionnel avec prévisualisation en temps réel.
          </p>
        </div>

        {/* Builder Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="rounded-2xl bg-card border border-border p-6 card-elevated">
              {/* Section Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              {activeSection === "personal" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" placeholder="Jean" defaultValue="Jean" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" placeholder="Dupont" defaultValue="Dupont" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre professionnel</Label>
                    <Input id="title" placeholder="Développeur Full Stack" defaultValue="Développeur Full Stack Senior" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="jean.dupont@email.com" defaultValue="jean.dupont@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Résumé professionnel</Label>
                    <Textarea
                      id="summary"
                      placeholder="Décrivez votre profil en quelques lignes..."
                      defaultValue="Développeur passionné avec 8+ ans d'expérience en développement web. Expert React, Node.js et architecture cloud."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {activeSection === "experience" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">Lead Developer</h4>
                        <p className="text-sm text-muted-foreground">TechCorp • 2021 - Présent</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">
                      Direction technique d'une équipe de 5 développeurs. Migration vers microservices avec +40% de performance.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">Développeur Senior</h4>
                        <p className="text-sm text-muted-foreground">StartupXYZ • 2018 - 2021</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">
                      Développement d'une plateforme SaaS B2B utilisée par 10K+ entreprises.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une expérience
                  </Button>
                </div>
              )}

              {activeSection === "education" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-semibold text-foreground">Master Informatique</h4>
                    <p className="text-sm text-muted-foreground">Université Paris-Saclay • 2015 - 2017</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-semibold text-foreground">Licence Informatique</h4>
                    <p className="text-sm text-muted-foreground">Université Paris-Saclay • 2012 - 2015</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une formation
                  </Button>
                </div>
              )}

              {activeSection === "skills" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <Label className="mb-3 block">Compétences techniques</Label>
                    <div className="flex flex-wrap gap-2">
                      {["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL"].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Soft Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Leadership", "Communication", "Gestion d'équipe", "Problem solving"].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une compétence
                  </Button>
                </div>
              )}
            </div>

            {/* Right: Preview */}
            <div className="rounded-2xl bg-card border border-border p-6 card-elevated">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Prévisualisation</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Aperçu
                  </Button>
                  <Button variant="default" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* CV Preview */}
              <div className="aspect-[210/297] bg-background rounded-lg border border-border overflow-hidden shadow-lg">
                <div className="h-full p-6 text-xs">
                  {/* Header */}
                  <div className="bg-primary text-primary-foreground p-4 -m-6 mb-4">
                    <h2 className="text-lg font-bold">Jean Dupont</h2>
                    <p className="text-primary-foreground/80 text-[10px]">Développeur Full Stack Senior</p>
                    <p className="text-primary-foreground/60 text-[8px] mt-1">jean.dupont@email.com • Paris, France</p>
                  </div>

                  {/* Summary */}
                  <div className="mb-4 mt-8">
                    <h3 className="text-[10px] font-bold text-primary border-b border-border pb-1 mb-2">
                      PROFIL
                    </h3>
                    <p className="text-[8px] text-muted-foreground leading-relaxed">
                      Développeur passionné avec 8+ ans d'expérience en développement web. Expert React, Node.js et architecture cloud.
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <h3 className="text-[10px] font-bold text-primary border-b border-border pb-1 mb-2">
                      EXPÉRIENCE
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-[9px]">Lead Developer</span>
                          <span className="text-[7px] text-muted-foreground">2021 - Présent</span>
                        </div>
                        <p className="text-[8px] text-accent">TechCorp</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-[9px]">Développeur Senior</span>
                          <span className="text-[7px] text-muted-foreground">2018 - 2021</span>
                        </div>
                        <p className="text-[8px] text-accent">StartupXYZ</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-[10px] font-bold text-primary border-b border-border pb-1 mb-2">
                      COMPÉTENCES
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {["React", "TypeScript", "Node.js", "AWS"].map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 bg-muted rounded text-[7px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CVBuilderPreview;
