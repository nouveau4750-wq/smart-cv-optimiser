import { FileText, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">SmartCV</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Le générateur de CV intelligent qui optimise automatiquement votre profil pour chaque offre d'emploi.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Modèles de CV</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">API</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Ressources</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Guides CV</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Cookies</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">RGPD</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2024 SmartCV. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
            <span>🇫🇷 Français</span>
            <span>🇬🇧 English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
