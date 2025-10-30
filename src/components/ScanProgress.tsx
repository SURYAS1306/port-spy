import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock } from 'lucide-react';

interface ScanProgressProps {
  target: string;
  currentPort: number;
  totalPorts: number;
  progress: number;
  estimatedTime: number;
}

export const ScanProgress = ({
  target,
  currentPort,
  totalPorts,
  progress,
  estimatedTime
}: ScanProgressProps) => {
  const remainingTime = Math.max(0, estimatedTime - (estimatedTime * progress) / 100);

  return (
    <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur animate-slide-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary animate-scan-pulse" />
            <div>
              <h3 className="font-semibold text-foreground">Scanning in Progress</h3>
              <p className="text-sm text-muted-foreground font-mono">
                Target: {target}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{remainingTime.toFixed(0)}s remaining</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Port {currentPort} / {totalPorts}
            </span>
            <span className="font-semibold text-primary">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary font-mono">{currentPort}</div>
            <div className="text-xs text-muted-foreground">Current Port</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground font-mono">{totalPorts}</div>
            <div className="text-xs text-muted-foreground">Total Ports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent font-mono">
              {Math.floor((progress / 100) * totalPorts)}
            </div>
            <div className="text-xs text-muted-foreground">Scanned</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
