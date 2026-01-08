import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, ArrowLeft, Loader2, Sparkles, Target, 
  CheckCircle, AlertCircle, TrendingUp, Lightbulb 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  compatibilityScore: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  keywords: { word: string; found: boolean }[];
}

const Analyze = () => {
  const { cvId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, subscription } = useAuth();
  const { toast } = useToast();

  const [cvTitle, setCvTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingCV, setLoadingCV] = useState(!!cvId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (cvId && user) {
      loadCV();
    }
  }, [cvId, user]);

  const loadCV = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('title')
        .eq('id', cvId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCvTitle(data.title);
      }
    } catch (error) {
      console.error('Error loading CV:', error);
    } finally {
      setLoadingCV(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Description requise',
        description: 'Veuillez coller une offre d\'emploi à analyser',
        variant: 'destructive',
      });
      return;
    }

    setAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-cv', {
        body: { 
          cvId,
          jobDescription,
        },
      });

      if (error) throw error;

      setResult(data);

      // Save analysis to database
      if (cvId) {
        await supabase.from('job_analyses').insert({
          user_id: user!.id,
          cv_id: cvId,
          job_description: jobDescription,
          compatibility_score: data.compatibilityScore,
          analysis_result: data,
          recommendations: data.recommendations,
        });

        // Update CV score
        await supabase
          .from('cvs')
          .update({ 
            last_score: data.compatibilityScore,
            last_analysis: data,
          })
          .eq('id', cvId);
      }

      toast({ title: 'Analyse terminée !' });
    } catch (error) {
      console.error('Error analyzing:', error);
      toast({
        title: 'Erreur d\'analyse',
        description: 'Impossible d\'analyser le CV',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'À améliorer';
    return 'Faible';
  };

  if (authLoading || loadingCV) {
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Analyse IA
              </h1>
              {cvTitle && (
                <p className="text-sm text-muted-foreground">
                  Analyse de "{cvTitle}"
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Offre d'emploi cible
                </CardTitle>
                <CardDescription>
                  Collez l'offre d'emploi pour analyser la compatibilité avec votre CV
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Collez ici la description de l'offre d'emploi...

Exemple:
Nous recherchons un Développeur Full Stack avec 3 ans d'expérience en React et Node.js..."
                  rows={12}
                  className="resize-none"
                />
                <Button 
                  onClick={handleAnalyze} 
                  disabled={analyzing || !jobDescription.trim()}
                  className="w-full"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyser la compatibilité
                    </>
                  )}
                </Button>

                {subscription.tier === 'free' && (
                  <p className="text-xs text-muted-foreground text-center">
                    3 analyses/mois en plan gratuit.{' '}
                    <Link to="/pricing" className="text-primary hover:underline">
                      Passez à Pro pour des analyses illimitées
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Score Card */}
                <Card className="overflow-hidden">
                  <div className="h-2 score-gradient" />
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Score de compatibilité</p>
                      <p className={`text-6xl font-bold ${getScoreColor(result.compatibilityScore)}`}>
                        {result.compatibilityScore}%
                      </p>
                      <Badge className={`mt-2 ${
                        result.compatibilityScore >= 80 ? 'bg-success' :
                        result.compatibilityScore >= 60 ? 'bg-warning' : 'bg-destructive'
                      }`}>
                        {getScoreLabel(result.compatibilityScore)}
                      </Badge>
                    </div>
                    <Progress value={result.compatibilityScore} className="h-2" />
                  </CardContent>
                </Card>

                {/* Keywords */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Mots-clés détectés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((kw, index) => (
                        <Badge 
                          key={index}
                          variant={kw.found ? 'default' : 'outline'}
                          className={kw.found ? 'bg-success' : ''}
                        >
                          {kw.found && <CheckCircle className="w-3 h-3 mr-1" />}
                          {!kw.found && <AlertCircle className="w-3 h-3 mr-1" />}
                          {kw.word}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      Points forts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Improvements */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      Points à améliorer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-accent" />
                      Recommandations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center text-muted-foreground">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    Prêt pour l'analyse
                  </p>
                  <p className="text-sm">
                    Collez une offre d'emploi et cliquez sur "Analyser" pour obtenir un score de compatibilité et des recommandations personnalisées
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analyze;
