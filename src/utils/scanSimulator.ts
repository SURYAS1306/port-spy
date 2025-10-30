import { PortStatus, getPortInfo, SCAN_PRESETS } from '@/data/portDatabase';

export interface ScanResult {
  port: number;
  status: PortStatus;
  service: string;
  description: string;
  risk: string;
  recommendation: string;
}

export type ScanType = 'quick' | 'standard' | 'full';

// Simulate realistic port scanning behavior
export const simulatePortScan = (
  target: string,
  scanType: ScanType
): { ports: number[]; shouldBeOpen: (port: number) => boolean } => {
  const ports = SCAN_PRESETS[scanType];
  
  // Determine target type
  const isLocalhost = target === 'localhost' || target === '127.0.0.1';
  const isPrivateIP = /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\./.test(target);
  const isDomain = /[a-zA-Z]/.test(target);
  
  // Simulate realistic open ports based on target type
  const shouldBeOpen = (port: number): boolean => {
    const random = Math.random();
    
    if (isLocalhost) {
      // Localhost typically has more services running
      const commonLocalPorts = [22, 80, 443, 3000, 3306, 5432, 8080, 27017];
      if (commonLocalPorts.includes(port)) return random > 0.3;
      return random > 0.85;
    }
    
    if (isPrivateIP) {
      // Home/private networks
      const commonHomePorts = [22, 80, 443, 445, 8080];
      if (commonHomePorts.includes(port)) return random > 0.4;
      return random > 0.9;
    }
    
    if (isDomain) {
      // Public websites
      const webPorts = [80, 443];
      if (webPorts.includes(port)) return random > 0.1; // Very likely open
      const commonServerPorts = [22, 25, 53, 110, 143, 465, 587, 993, 995];
      if (commonServerPorts.includes(port)) return random > 0.6;
      return random > 0.95; // Most other ports closed on public sites
    }
    
    // Default: mostly closed
    return random > 0.9;
  };
  
  return { ports, shouldBeOpen };
};

export const generateScanResult = (
  port: number,
  isOpen: boolean,
  target: string
): ScanResult => {
  const portInfo = getPortInfo(port);
  
  // Determine status with some filtered results
  let status: PortStatus;
  if (isOpen) {
    status = 'open';
  } else {
    // Some ports are filtered instead of closed
    status = Math.random() > 0.8 ? 'filtered' : 'closed';
  }
  
  return {
    port,
    status,
    service: portInfo.service,
    description: portInfo.description,
    risk: portInfo.risk,
    recommendation: portInfo.recommendation
  };
};

export const validateTarget = (target: string): { isValid: boolean; error?: string } => {
  if (!target || target.trim() === '') {
    return { isValid: false, error: 'Target cannot be empty' };
  }
  
  // IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(target)) {
    const parts = target.split('.').map(Number);
    const allValid = parts.every(part => part >= 0 && part <= 255);
    if (!allValid) {
      return { isValid: false, error: 'Invalid IPv4 address. Each octet must be 0-255.' };
    }
    return { isValid: true };
  }
  
  // Domain name validation
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  if (domainRegex.test(target) || target === 'localhost') {
    return { isValid: true };
  }
  
  return { isValid: false, error: 'Invalid target. Enter a valid IP address or domain name.' };
};

export const estimateScanTime = (scanType: ScanType): number => {
  const baseTimes = {
    quick: 8,
    standard: 15,
    full: 45
  };
  return baseTimes[scanType];
};
