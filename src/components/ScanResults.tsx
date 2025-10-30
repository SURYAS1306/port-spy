import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ArrowUpDown,
  Search,
  Download,
  Clock
} from 'lucide-react';
import { ScanResult } from '@/utils/scanSimulator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScanResultsProps {
  results: ScanResult[];
  target: string;
  scanDuration: number;
  onExport: (format: 'txt' | 'csv' | 'json') => void;
}

type SortField = 'port' | 'status' | 'risk';
type FilterStatus = 'all' | 'open' | 'closed' | 'filtered';

export const ScanResults = ({ results, target, scanDuration, onExport }: ScanResultsProps) => {
  const [sortField, setSortField] = useState<SortField>('port');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => {
    const open = results.filter(r => r.status === 'open').length;
    const closed = results.filter(r => r.status === 'closed').length;
    const filtered = results.filter(r => r.status === 'filtered').length;
    return { total: results.length, open, closed, filtered };
  }, [results]);

  const filteredAndSorted = useMemo(() => {
    let filtered = results;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.port.toString().includes(searchQuery) ||
        r.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'port') {
        comparison = a.port - b.port;
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'risk') {
        const riskOrder = { high: 3, medium: 2, low: 1 };
        comparison = riskOrder[a.risk as keyof typeof riskOrder] - riskOrder[b.risk as keyof typeof riskOrder];
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [results, filterStatus, searchQuery, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      case 'filtered':
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-success/20 text-success border-success/30';
      case 'closed':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'filtered':
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high':
        return <ShieldAlert className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Shield className="h-4 w-4 text-warning" />;
      case 'low':
        return <ShieldCheck className="h-4 w-4 text-success" />;
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 border-primary/20 bg-card/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-mono">{stats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Scanned</div>
          </div>
        </Card>
        <Card className="p-4 border-success/20 bg-card/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-success font-mono">{stats.open}</div>
            <div className="text-xs text-muted-foreground mt-1">Open Ports</div>
          </div>
        </Card>
        <Card className="p-4 border-destructive/20 bg-card/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-destructive font-mono">{stats.closed}</div>
            <div className="text-xs text-muted-foreground mt-1">Closed Ports</div>
          </div>
        </Card>
        <Card className="p-4 border-warning/20 bg-card/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-warning font-mono">{stats.filtered}</div>
            <div className="text-xs text-muted-foreground mt-1">Filtered</div>
          </div>
        </Card>
        <Card className="p-4 border-accent/20 bg-card/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent font-mono">{scanDuration}s</div>
            <div className="text-xs text-muted-foreground mt-1">Duration</div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-4 border-primary/20 bg-card/50">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(['all', 'open', 'closed', 'filtered'] as FilterStatus[]).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? 'bg-primary' : 'border-primary/30'}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ports, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-primary/30"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => onExport('csv')} className="border-primary/30">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Results</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card className="border-primary/20 bg-card/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20 hover:bg-transparent">
                <TableHead className="text-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('port')}
                    className="hover:bg-primary/10"
                  >
                    Port
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('status')}
                    className="hover:bg-primary/10"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-foreground">Service</TableHead>
                <TableHead className="text-foreground">Description</TableHead>
                <TableHead className="text-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('risk')}
                    className="hover:bg-primary/10"
                  >
                    Risk
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSorted.map((result) => (
                <TooltipProvider key={result.port}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableRow className="border-primary/10 hover:bg-primary/5 cursor-pointer transition-colors">
                        <TableCell className="font-mono font-semibold text-primary">
                          {result.port}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(result.status)} flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(result.status)}
                            {result.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{result.service}</TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-md truncate">
                          {result.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRiskIcon(result.risk)}
                            <span className="text-sm capitalize">{result.risk}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-sm">
                      <div className="space-y-2">
                        <div className="font-semibold">Security Recommendation:</div>
                        <div className="text-sm">{result.recommendation}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results found matching your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
};
