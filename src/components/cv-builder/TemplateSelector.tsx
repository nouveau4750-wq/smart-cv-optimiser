import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

const templates = [
  { id: 'modern', name: 'Modern', premium: false },
  { id: 'classic', name: 'Classique', premium: false },
  { id: 'minimal', name: 'Minimal', premium: false },
  { id: 'creative', name: 'Créatif', premium: true },
  { id: 'executive', name: 'Executive', premium: true },
  { id: 'tech', name: 'Tech', premium: true },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (id: string) => void;
  isPro: boolean;
}

const TemplateSelector = ({ selectedTemplate, onSelect, isPro }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Choisir un template</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const isLocked = template.premium && !isPro;
          return (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate === template.id 
                  ? 'ring-2 ring-primary' 
                  : 'hover:border-primary/50'
              } ${isLocked ? 'opacity-60' : ''}`}
              onClick={() => !isLocked && onSelect(template.id)}
            >
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-muted rounded mb-2 flex items-center justify-center">
                  {isLocked ? (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground">
                      {template.name[0]}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{template.name}</span>
                  {template.premium && (
                    <Badge variant="secondary" className="text-xs">Pro</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
