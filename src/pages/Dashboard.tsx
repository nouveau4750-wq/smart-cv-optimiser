import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Plus, Eye, Download, TrendingUp, Calendar, 
  LogOut, Crown, Loader2, MoreVertical, Trash2, Edit, FileDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CV {
  id: string;
  title: string;
  template_id: string;
  views_count: number;
  downloads_count: number;
  last_score: number | null;
  created_at: string;
  updated_at: string;
  personal_info: Record<string, string> | null;
  experience: Array<Record<string, string>> | null;
  education: Array<Record<string, string>> | null;
  skills: Array<Record<string, string>> | null;
  languages: Array<Record<string, string>> | null;
  summary: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, subscription, signOut } = useAuth();
  const { toast } = useToast();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loadingCvs, setLoadingCvs] = useState(true);
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchCvs();
    }
  }, [user]);

  const fetchCvs = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCvs(data || []);
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoadingCvs(false);
    }
  };

  const handleDeleteCV = async (id: string) => {
    try {
      const { error } = await supabase.from('cvs').delete().eq('id', id);
      if (error) throw error;
      setCvs(cvs.filter(cv => cv.id !== id));
      toast({ title: 'CV supprimé' });
    } catch (error) {
      toast({ 
        title: 'Erreur', 
        description: 'Impossible de supprimer le CV',
        variant: 'destructive' 
      });
    }
  };

  const handleExportPDF = async (cv: CV) => {
    setExportingId(cv.id);
    
    try {
      // Create a temporary container for the CV content
      const container = document.createElement('div');
      container.style.width = '210mm';
      container.style.padding = '20mm';
      container.style.backgroundColor = 'white';
      container.style.fontFamily = 'Arial, sans-serif';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      
      const personalInfo = cv.personal_info || {};
      const experience = cv.experience || [];
      const education = cv.education || [];
      const skills = cv.skills || [];
      const languages = cv.languages || [];
      
      container.innerHTML = `
        <div style="color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px; color: #1a1a1a;">${personalInfo.fullName || 'Sans nom'}</h1>
            <p style="margin: 8px 0 0; color: #666; font-size: 14px;">
              ${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' • ')}
            </p>
          </div>
          
          ${cv.summary ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 16px; color: #6366f1; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Résumé</h2>
              <p style="margin: 0; line-height: 1.6; color: #444;">${cv.summary}</p>
            </div>
          ` : ''}
          
          ${experience.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 16px; color: #6366f1; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px;">Expérience Professionnelle</h2>
              ${experience.map(exp => `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <h3 style="margin: 0; font-size: 14px; font-weight: 600;">${exp.position || ''}</h3>
                    <span style="font-size: 12px; color: #666;">${exp.startDate || ''} - ${exp.endDate || ''}</span>
                  </div>
                  <p style="margin: 4px 0; color: #6366f1; font-size: 13px;">${exp.company || ''}</p>
                  <p style="margin: 8px 0 0; font-size: 13px; line-height: 1.5; color: #444;">${exp.description || ''}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${education.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 16px; color: #6366f1; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px;">Formation</h2>
              ${education.map(edu => `
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <h3 style="margin: 0; font-size: 14px; font-weight: 600;">${edu.degree || ''}</h3>
                    <span style="font-size: 12px; color: #666;">${edu.startDate || ''} - ${edu.endDate || ''}</span>
                  </div>
                  <p style="margin: 4px 0; color: #6366f1; font-size: 13px;">${edu.school || ''}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div style="display: flex; gap: 40px;">
            ${skills.length > 0 ? `
              <div style="flex: 1;">
                <h2 style="font-size: 16px; color: #6366f1; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Compétences</h2>
                <ul style="margin: 0; padding-left: 20px;">
                  ${skills.map(skill => `<li style="font-size: 13px; margin-bottom: 5px;">${skill.name}${skill.level ? ` (${skill.level})` : ''}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            ${languages.length > 0 ? `
              <div style="flex: 1;">
                <h2 style="font-size: 16px; color: #6366f1; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Langues</h2>
                <ul style="margin: 0; padding-left: 20px;">
                  ${languages.map(lang => `<li style="font-size: 13px; margin-bottom: 5px;">${lang.name}${lang.level ? ` (${lang.level})` : ''}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      document.body.removeChild(container);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cv.title || 'mon-cv'}.pdf`);
      
      // Update download count
      await supabase
        .from('cvs')
        .update({ downloads_count: (cv.downloads_count || 0) + 1 })
        .eq('id', cv.id);
      
      setCvs(cvs.map(c => c.id === cv.id ? { ...c, downloads_count: (c.downloads_count || 0) + 1 } : c));
      
      toast({ title: 'PDF exporté avec succès!' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({ 
        title: 'Erreur', 
        description: 'Impossible d\'exporter le PDF',
        variant: 'destructive' 
      });
    } finally {
      setExportingId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getTierBadge = () => {
    if (subscription.tier === 'enterprise') {
      return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Enterprise</Badge>;
    }
    if (subscription.tier === 'pro') {
      return <Badge className="bg-gradient-to-r from-accent to-success text-white">Pro</Badge>;
    }
    return <Badge variant="secondary">Gratuit</Badge>;
  };

  const totalViews = cvs.reduce((sum, cv) => sum + cv.views_count, 0);
  const totalDownloads = cvs.reduce((sum, cv) => sum + cv.downloads_count, 0);
  const avgScore = cvs.filter(cv => cv.last_score).reduce((sum, cv, _, arr) => 
    sum + (cv.last_score || 0) / arr.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SmartCV</span>
            </Link>

            <div className="flex items-center gap-4">
              {getTierBadge()}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bonjour ! 👋
          </h1>
          <p className="text-muted-foreground">
            Gérez vos CV et suivez leurs performances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total CVs</p>
                  <p className="text-2xl font-bold">{cvs.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vues totales</p>
                  <p className="text-2xl font-bold">{totalViews}</p>
                </div>
                <Eye className="w-8 h-8 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Téléchargements</p>
                  <p className="text-2xl font-bold">{totalDownloads}</p>
                </div>
                <Download className="w-8 h-8 text-success opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Score moyen</p>
                  <p className="text-2xl font-bold">
                    {avgScore > 0 ? `${Math.round(avgScore)}%` : '-'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-warning opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Banner for Free users */}
        {subscription.tier === 'free' && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Crown className="w-10 h-10 text-accent" />
                  <div>
                    <h3 className="font-semibold text-lg">Passez à Pro</h3>
                    <p className="text-muted-foreground">
                      Débloquez les templates premium, l'analyse IA illimitée et plus encore
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/pricing">Voir les offres</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CVs Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Mes CV</h2>
          <Button asChild>
            <Link to="/cv-builder">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau CV
            </Link>
          </Button>
        </div>

        {loadingCvs ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : cvs.length === 0 ? (
          <Card className="card-elevated">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun CV pour le moment</h3>
              <p className="text-muted-foreground mb-6">
                Créez votre premier CV professionnel en quelques minutes
              </p>
              <Button asChild>
                <Link to="/cv-builder">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer mon premier CV
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.map((cv) => (
              <Card key={cv.id} className="card-elevated group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{cv.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(cv.updated_at).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/cv-builder/${cv.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportPDF(cv)}>
                          <FileDown className="w-4 h-4 mr-2" />
                          Exporter PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteCV(cv.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {cv.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {cv.downloads_count}
                    </span>
                    {cv.last_score && (
                      <Badge variant="outline" className="ml-auto">
                        Score: {cv.last_score}%
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/cv-builder/${cv.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Éditer
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleExportPDF(cv)}
                      disabled={exportingId === cv.id}
                    >
                      {exportingId === cv.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileDown className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/analyze/${cv.id}`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Analyser
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
