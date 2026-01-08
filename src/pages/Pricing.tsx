import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, STRIPE_PRODUCTS } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, FileText, Loader2, Crown, Zap, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    description: 'Parfait pour débuter',
    icon: FileText,
    features: [
      '3 CV maximum',
      '5 templates basiques',
      'Export PDF (avec watermark)',
      '3 analyses IA/mois',
      'Support email',
    ],
    notIncluded: [
      'Templates premium',
      'Analyse IA illimitée',
      'Export sans watermark',
    ],
    priceId: null,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.90,
    description: 'Pour les professionnels ambitieux',
    icon: Zap,
    features: [
      'CV illimités',
      'Tous les templates premium',
      'Export PDF sans watermark',
      'Analyse IA illimitée',
      'Scoring ATS avancé',
      'Support prioritaire',
      'Suggestions personnalisées',
    ],
    notIncluded: [],
    priceId: STRIPE_PRODUCTS.pro.priceId,
    productId: STRIPE_PRODUCTS.pro.productId,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.90,
    description: 'Pour les équipes et entreprises',
    icon: Building2,
    features: [
      'Tout de Pro inclus',
      'Gestion d\'équipe',
      'API d\'intégration',
      'Templates personnalisés',
      'Account manager dédié',
      'SLA garanti',
      'Facturation annuelle',
    ],
    notIncluded: [],
    priceId: STRIPE_PRODUCTS.enterprise.priceId,
    productId: STRIPE_PRODUCTS.enterprise.productId,
    popular: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, priceId: string | null) => {
    if (!priceId) return; // Free plan

    if (!user) {
      navigate('/auth');
      return;
    }

    setLoadingPlan(planId);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la session de paiement',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPlan('manage');
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ouvrir le portail de gestion',
        variant: 'destructive',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    return subscription.tier === planId;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="mb-4">Tarifs</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Choisissez votre plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Commencez gratuitement, évoluez selon vos besoins. 
              Annulez à tout moment.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = isCurrentPlan(plan.id);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative card-elevated ${
                    plan.popular 
                      ? 'border-2 border-accent ring-2 ring-accent/20' 
                      : ''
                  } ${isCurrent ? 'bg-primary/5' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-accent text-accent-foreground">
                        <Crown className="w-3 h-3 mr-1" />
                        Populaire
                      </Badge>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="outline" className="bg-background">
                        Votre plan
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/mois</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {isCurrent && subscription.subscribed ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleManageSubscription}
                        disabled={loadingPlan === 'manage'}
                      >
                        {loadingPlan === 'manage' && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Gérer l'abonnement
                      </Button>
                    ) : plan.id === 'free' ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                      >
                        <Link to={user ? '/dashboard' : '/auth'}>
                          {user ? 'Aller au dashboard' : 'Commencer gratuitement'}
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90' : ''}`}
                        onClick={() => handleSubscribe(plan.id, plan.priceId)}
                        disabled={loadingPlan === plan.id || isCurrent}
                      >
                        {loadingPlan === plan.id && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        {isCurrent ? 'Plan actuel' : 'Choisir ce plan'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
            <div className="text-left space-y-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold mb-2">Puis-je changer de plan ?</h3>
                <p className="text-sm text-muted-foreground">
                  Oui, vous pouvez upgrader ou downgrader à tout moment. 
                  Les changements prennent effet immédiatement.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold mb-2">Comment annuler mon abonnement ?</h3>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur "Gérer l'abonnement" pour accéder au portail Stripe 
                  où vous pouvez annuler à tout moment.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold mb-2">Mes CV sont-ils conservés si je downgrade ?</h3>
                <p className="text-sm text-muted-foreground">
                  Oui, vos CV sont toujours accessibles. Seules certaines 
                  fonctionnalités premium seront désactivées.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
