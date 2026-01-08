import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Save, Download, ArrowLeft, Plus, Trash2, 
  Loader2, User, Briefcase, GraduationCap, Award, Languages, Settings 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CVPreview from '@/components/cv-builder/CVPreview';
import TemplateSelector from '@/components/cv-builder/TemplateSelector';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  photo: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
}

const defaultCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
    photo: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
};

const CVBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, subscription } = useAuth();
  const { toast } = useToast();
  
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [title, setTitle] = useState('Mon CV');
  const [templateId, setTemplateId] = useState('modern');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (id && user) {
      loadCV();
    }
  }, [id, user]);

  const loadCV = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast({ title: 'CV introuvable', variant: 'destructive' });
        navigate('/dashboard');
        return;
      }

      setTitle(data.title);
      setTemplateId(data.template_id);
      setCvData({
        personalInfo: (data.personal_info as unknown as PersonalInfo) || defaultCVData.personalInfo,
        summary: data.summary || '',
        experience: (data.experience as unknown as Experience[]) || [],
        education: (data.education as unknown as Education[]) || [],
        skills: (data.skills as unknown as Skill[]) || [],
        languages: (data.languages as unknown as Language[]) || [],
      });
    } catch (error) {
      console.error('Error loading CV:', error);
      toast({ title: 'Erreur de chargement', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveCV = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const cvPayload = {
        title,
        template_id: templateId,
        personal_info: JSON.parse(JSON.stringify(cvData.personalInfo)),
        summary: cvData.summary,
        experience: JSON.parse(JSON.stringify(cvData.experience)),
        education: JSON.parse(JSON.stringify(cvData.education)),
        skills: JSON.parse(JSON.stringify(cvData.skills)),
        languages: JSON.parse(JSON.stringify(cvData.languages)),
        user_id: user.id,
      };
      let result;
      if (id) {
        result = await supabase
          .from('cvs')
          .update(cvPayload)
          .eq('id', id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('cvs')
          .insert(cvPayload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({ title: 'CV sauvegardé !' });
      
      if (!id && result.data) {
        navigate(`/cv-builder/${result.data.id}`, { replace: true });
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      toast({ title: 'Erreur de sauvegarde', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: crypto.randomUUID(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      }]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: crypto.randomUUID(),
        degree: '',
        school: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      }]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: crypto.randomUUID(), name: '', level: 50 }]
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-semibold border-none bg-transparent focus-visible:ring-0 w-48"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={saveCV} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="ml-2 hidden sm:inline">Sauvegarder</span>
              </Button>
              <Button>
                <Download className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">Exporter PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="personal">
                  <User className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="experience">
                  <Briefcase className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="education">
                  <GraduationCap className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Award className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="template">
                  <Settings className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Prénom</Label>
                        <Input 
                          value={cvData.personalInfo.firstName}
                          onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                          placeholder="Jean"
                        />
                      </div>
                      <div>
                        <Label>Nom</Label>
                        <Input 
                          value={cvData.personalInfo.lastName}
                          onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                          placeholder="Dupont"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input 
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        placeholder="jean@exemple.com"
                      />
                    </div>
                    <div>
                      <Label>Téléphone</Label>
                      <Input 
                        value={cvData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <div>
                      <Label>Adresse</Label>
                      <Input 
                        value={cvData.personalInfo.address}
                        onChange={(e) => updatePersonalInfo('address', e.target.value)}
                        placeholder="Paris, France"
                      />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input 
                        value={cvData.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/jeandupont"
                      />
                    </div>
                    <div>
                      <Label>Résumé professionnel</Label>
                      <Textarea 
                        value={cvData.summary}
                        onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Décrivez votre parcours et vos objectifs..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Expériences professionnelles</h3>
                  <Button variant="outline" size="sm" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                {cvData.experience.map((exp, index) => (
                  <Card key={exp.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Expérience {index + 1}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Poste</Label>
                          <Input 
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                            placeholder="Développeur Web"
                          />
                        </div>
                        <div>
                          <Label>Entreprise</Label>
                          <Input 
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Tech Corp"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Date début</Label>
                          <Input 
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Date fin</Label>
                          <Input 
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea 
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Décrivez vos responsabilités et réalisations..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {cvData.experience.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Aucune expérience ajoutée
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="education" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Formation</h3>
                  <Button variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                {cvData.education.map((edu, index) => (
                  <Card key={edu.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Formation {index + 1}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Diplôme</Label>
                        <Input 
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Master en Informatique"
                        />
                      </div>
                      <div>
                        <Label>École</Label>
                        <Input 
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          placeholder="Université de Paris"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Date début</Label>
                          <Input 
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Date fin</Label>
                          <Input 
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {cvData.education.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Aucune formation ajoutée
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="skills" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Compétences</h3>
                  <Button variant="outline" size="sm" onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    {cvData.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-3">
                        <Input 
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          placeholder="JavaScript"
                          className="flex-1"
                        />
                        <Input 
                          type="number"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeSkill(skill.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    {cvData.skills.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Aucune compétence ajoutée
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="template" className="mt-4">
                <TemplateSelector 
                  selectedTemplate={templateId}
                  onSelect={setTemplateId}
                  isPro={subscription.tier !== 'free'}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)]">
            <Card className="h-full overflow-hidden">
              <CardContent className="p-0 h-full overflow-auto">
                <CVPreview data={cvData} templateId={templateId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
