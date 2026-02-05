import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useMotivationalQuote } from '../hooks/useMotivationalQuote';

export default function MotivationalQuoteCard() {
  const { quote, author, refresh } = useMotivationalQuote();

  return (
    <Card className="bg-gradient-to-br from-accent/50 to-accent/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-lg font-medium text-foreground mb-2 italic">"{quote}"</p>
            {author && <p className="text-sm text-muted-foreground">— {author}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={refresh} className="shrink-0">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
