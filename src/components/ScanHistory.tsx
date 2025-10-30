import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export interface HistoryEntry {
  id: string;
  target: string;
  timestamp: number;
  openPorts: number;
  totalPorts: number;
  scanType: string;
}

interface ScanHistoryProps {
  history: HistoryEntry[];
  onViewHistory: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
}

export const ScanHistory = ({ history, onViewHistory, onClearHistory }: ScanHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="p-6 border-primary/20 bg-card/50 text-center">
        <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No scan history yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start your first scan to see results here
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-primary/20 bg-card/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Scan History</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearHistory}
          className="border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {history.map((entry) => (
            <Card
              key={entry.id}
              className="p-4 border-primary/10 bg-background/50 hover:bg-primary/5 transition-colors cursor-pointer"
              onClick={() => onViewHistory(entry)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-primary">{entry.target}</span>
                    <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                      {entry.scanType}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(entry.timestamp, 'MMM dd, yyyy HH:mm')}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-success">{entry.openPorts}</span>
                      <span>/</span>
                      <span>{entry.totalPorts}</span>
                      <span>ports open</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
