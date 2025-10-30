import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Shield, Terminal, Zap } from 'lucide-react';
import { ScanType, validateTarget } from '@/utils/scanSimulator';

interface ScannerInputProps {
  onStartScan: (target: string, scanType: ScanType) => void;
  isScanning: boolean;
}

export const ScannerInput = ({ onStartScan, isScanning }: ScannerInputProps) => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState<ScanType>('quick');
  const [error, setError] = useState('');

  const handleStartScan = () => {
    const validation = validateTarget(target);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid target');
      return;
    }
    setError('');
    onStartScan(target, scanType);
  };

  const quickActions = [
    { label: 'Scan Localhost', value: 'localhost', icon: Terminal },
    { label: 'Scan Router', value: '192.168.1.1', icon: Shield },
  ];

  return (
    <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary animate-glow" />
            <h2 className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              Network Port Scanner
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Identify open ports and security risks • Educational purposes only
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target" className="text-foreground">
              Target IP Address or Domain
            </Label>
            <Input
              id="target"
              placeholder="e.g., 192.168.1.1 or example.com"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setError('');
              }}
              disabled={isScanning}
              className="font-mono bg-background/50 border-primary/30 focus:border-primary"
            />
            {error && (
              <p className="text-sm text-destructive animate-slide-in">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scanType" className="text-foreground">
              Scan Type
            </Label>
            <Select
              value={scanType}
              onValueChange={(value) => setScanType(value as ScanType)}
              disabled={isScanning}
            >
              <SelectTrigger className="bg-background/50 border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quick">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Quick Scan</div>
                      <div className="text-xs text-muted-foreground">~15 most common ports</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="standard">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Standard Scan</div>
                      <div className="text-xs text-muted-foreground">~30 frequently used ports</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="full">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Full Scan</div>
                      <div className="text-xs text-muted-foreground">Top 100 ports</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleStartScan}
            disabled={isScanning || !target}
            className="w-full h-12 text-lg font-semibold bg-gradient-cyber hover:opacity-90 transition-opacity"
          >
            {isScanning ? (
              <>
                <span className="animate-scan-pulse">Scanning...</span>
              </>
            ) : (
              'Start Scan'
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {quickActions.map((action) => (
              <Button
                key={action.value}
                variant="outline"
                size="sm"
                onClick={() => {
                  setTarget(action.value);
                  setError('');
                }}
                disabled={isScanning}
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground border-t border-border pt-4">
          ⚠️ For educational use only. Only scan networks you own or have permission to test.
        </div>
      </div>
    </Card>
  );
};
