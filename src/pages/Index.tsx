import { useState, useEffect } from 'react';
import { ScannerInput } from '@/components/ScannerInput';
import { ScanProgress } from '@/components/ScanProgress';
import { ScanResults } from '@/components/ScanResults';
import { ScanHistory, HistoryEntry } from '@/components/ScanHistory';
import { EducationalInfo } from '@/components/EducationalInfo';
import {
  ScanType,
  simulatePortScan,
  generateScanResult,
  estimateScanTime,
  ScanResult
} from '@/utils/scanSimulator';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentTarget, setCurrentTarget] = useState('');
  const [currentPort, setCurrentPort] = useState(0);
  const [totalPorts, setTotalPorts] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [scanStartTime, setScanStartTime] = useState(0);
  const [scanDuration, setScanDuration] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('scanHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleStartScan = async (target: string, scanType: ScanType) => {
    setIsScanning(true);
    setCurrentTarget(target);
    setScanResults([]);
    setProgress(0);
    
    const { ports, shouldBeOpen } = simulatePortScan(target, scanType);
    setTotalPorts(ports.length);
    setCurrentPort(0);
    
    const estimated = estimateScanTime(scanType);
    setEstimatedTime(estimated);
    setScanStartTime(Date.now());

    const results: ScanResult[] = [];
    const delayPerPort = (estimated * 1000) / ports.length;

    for (let i = 0; i < ports.length; i++) {
      const port = ports[i];
      setCurrentPort(port);
      setProgress(((i + 1) / ports.length) * 100);

      const isOpen = shouldBeOpen(port);
      const result = generateScanResult(port, isOpen, target);
      results.push(result);

      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, delayPerPort));
    }

    const duration = Math.round((Date.now() - scanStartTime) / 1000);
    setScanDuration(duration);
    setScanResults(results);
    setIsScanning(false);

    // Save to history
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      target,
      timestamp: Date.now(),
      openPorts: results.filter(r => r.status === 'open').length,
      totalPorts: results.length,
      scanType: scanType.toUpperCase()
    };
    
    const newHistory = [newEntry, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem('scanHistory', JSON.stringify(newHistory));

    toast({
      title: 'Scan Complete',
      description: `Found ${newEntry.openPorts} open ports on ${target}`,
    });
  };

  const handleExport = (format: 'txt' | 'csv' | 'json') => {
    let content = '';
    let filename = `port-scan-${currentTarget}-${Date.now()}`;
    let mimeType = 'text/plain';

    if (format === 'txt') {
      content = `Port Scan Report\n`;
      content += `Target: ${currentTarget}\n`;
      content += `Date: ${new Date().toLocaleString()}\n`;
      content += `Duration: ${scanDuration}s\n\n`;
      content += `Port\tStatus\tService\tRisk\n`;
      content += `----\t------\t-------\t----\n`;
      scanResults.forEach(r => {
        content += `${r.port}\t${r.status}\t${r.service}\t${r.risk}\n`;
      });
    } else if (format === 'csv') {
      mimeType = 'text/csv';
      filename += '.csv';
      content = 'Port,Status,Service,Description,Risk,Recommendation\n';
      scanResults.forEach(r => {
        content += `${r.port},"${r.status}","${r.service}","${r.description}","${r.risk}","${r.recommendation}"\n`;
      });
    } else if (format === 'json') {
      mimeType = 'application/json';
      filename += '.json';
      content = JSON.stringify({
        target: currentTarget,
        scanDate: new Date().toISOString(),
        duration: scanDuration,
        results: scanResults
      }, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: `Results exported as ${format.toUpperCase()}`,
    });
  };

  const handleViewHistory = (entry: HistoryEntry) => {
    toast({
      title: 'Historical Scan',
      description: `Viewing scan from ${new Date(entry.timestamp).toLocaleString()}`,
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scanHistory');
    toast({
      title: 'History Cleared',
      description: 'All scan history has been removed',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <ScannerInput onStartScan={handleStartScan} isScanning={isScanning} />

          {isScanning && (
            <ScanProgress
              target={currentTarget}
              currentPort={currentPort}
              totalPorts={totalPorts}
              progress={progress}
              estimatedTime={estimatedTime}
            />
          )}

          {scanResults.length > 0 && !isScanning && (
            <ScanResults
              results={scanResults}
              target={currentTarget}
              scanDuration={scanDuration}
              onExport={handleExport}
            />
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <ScanHistory
              history={history}
              onViewHistory={handleViewHistory}
              onClearHistory={handleClearHistory}
            />
            <EducationalInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
