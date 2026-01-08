import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TemplatesSection from "@/components/TemplatesSection";
import ScoringSection from "@/components/ScoringSection";
import CVBuilderPreview from "@/components/CVBuilderPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TemplatesSection />
        <ScoringSection />
        <CVBuilderPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
