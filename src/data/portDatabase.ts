export type RiskLevel = 'low' | 'medium' | 'high';
export type PortStatus = 'open' | 'closed' | 'filtered';

export interface PortInfo {
  port: number;
  service: string;
  description: string;
  risk: RiskLevel;
  recommendation: string;
}

export const PORT_DATABASE: Record<number, PortInfo> = {
  20: {
    port: 20,
    service: 'FTP Data',
    description: 'File Transfer Protocol - Data Transfer',
    risk: 'high',
    recommendation: 'Use SFTP (port 22) instead. FTP transmits data unencrypted.'
  },
  21: {
    port: 21,
    service: 'FTP',
    description: 'File Transfer Protocol - Control',
    risk: 'high',
    recommendation: 'Replace with SFTP. FTP sends credentials in plain text.'
  },
  22: {
    port: 22,
    service: 'SSH',
    description: 'Secure Shell - Remote server access',
    risk: 'medium',
    recommendation: 'Use key-based authentication, disable password login, and change default port.'
  },
  23: {
    port: 23,
    service: 'Telnet',
    description: 'Unencrypted remote access',
    risk: 'high',
    recommendation: 'Disable immediately. Use SSH instead. Telnet is extremely insecure.'
  },
  25: {
    port: 25,
    service: 'SMTP',
    description: 'Simple Mail Transfer Protocol - Email sending',
    risk: 'medium',
    recommendation: 'Use authentication and encryption. Vulnerable to spam relay if misconfigured.'
  },
  53: {
    port: 53,
    service: 'DNS',
    description: 'Domain Name System',
    risk: 'low',
    recommendation: 'Ensure DNS amplification attacks are mitigated.'
  },
  80: {
    port: 80,
    service: 'HTTP',
    description: 'HyperText Transfer Protocol - Web traffic',
    risk: 'low',
    recommendation: 'Redirect all traffic to HTTPS (port 443) for encryption.'
  },
  110: {
    port: 110,
    service: 'POP3',
    description: 'Post Office Protocol - Email retrieval',
    risk: 'medium',
    recommendation: 'Use POP3S (port 995) or IMAP with SSL/TLS instead.'
  },
  143: {
    port: 143,
    service: 'IMAP',
    description: 'Internet Message Access Protocol - Email access',
    risk: 'medium',
    recommendation: 'Use IMAPS (port 993) for encrypted email access.'
  },
  443: {
    port: 443,
    service: 'HTTPS',
    description: 'HTTP Secure - Encrypted web traffic',
    risk: 'low',
    recommendation: 'Ensure valid SSL/TLS certificates and strong cipher suites.'
  },
  445: {
    port: 445,
    service: 'SMB',
    description: 'Server Message Block - Windows file sharing',
    risk: 'high',
    recommendation: 'Block from internet. Frequent target for ransomware attacks.'
  },
  465: {
    port: 465,
    service: 'SMTPS',
    description: 'SMTP Secure - Encrypted email sending',
    risk: 'low',
    recommendation: 'Use with proper authentication to prevent spam relay.'
  },
  587: {
    port: 587,
    service: 'SMTP',
    description: 'Mail submission - Modern email sending',
    risk: 'low',
    recommendation: 'Preferred port for email submission with STARTTLS.'
  },
  993: {
    port: 993,
    service: 'IMAPS',
    description: 'IMAP Secure - Encrypted email access',
    risk: 'low',
    recommendation: 'Secure alternative to port 143.'
  },
  995: {
    port: 995,
    service: 'POP3S',
    description: 'POP3 Secure - Encrypted email retrieval',
    risk: 'low',
    recommendation: 'Secure alternative to port 110.'
  },
  1433: {
    port: 1433,
    service: 'MSSQL',
    description: 'Microsoft SQL Server database',
    risk: 'high',
    recommendation: 'Never expose to internet. Use VPN or firewall rules.'
  },
  1521: {
    port: 1521,
    service: 'Oracle DB',
    description: 'Oracle Database listener',
    risk: 'high',
    recommendation: 'Restrict access to trusted IPs only.'
  },
  3306: {
    port: 3306,
    service: 'MySQL',
    description: 'MySQL/MariaDB database server',
    risk: 'high',
    recommendation: 'Never expose to internet. Bind to localhost only.'
  },
  3389: {
    port: 3389,
    service: 'RDP',
    description: 'Remote Desktop Protocol - Windows remote access',
    risk: 'high',
    recommendation: 'Disable if not needed. Use VPN, change default port, enable NLA.'
  },
  5432: {
    port: 5432,
    service: 'PostgreSQL',
    description: 'PostgreSQL database server',
    risk: 'high',
    recommendation: 'Never expose directly. Use SSH tunneling or private network.'
  },
  5900: {
    port: 5900,
    service: 'VNC',
    description: 'Virtual Network Computing - Remote desktop',
    risk: 'high',
    recommendation: 'Use SSH tunneling. VNC authentication is weak.'
  },
  6379: {
    port: 6379,
    service: 'Redis',
    description: 'Redis in-memory database',
    risk: 'high',
    recommendation: 'Never expose to internet. No authentication by default.'
  },
  8080: {
    port: 8080,
    service: 'HTTP Alt',
    description: 'Alternative HTTP port - Web applications',
    risk: 'low',
    recommendation: 'Often used for development. Secure like port 80/443.'
  },
  8443: {
    port: 8443,
    service: 'HTTPS Alt',
    description: 'Alternative HTTPS port',
    risk: 'low',
    recommendation: 'Ensure proper SSL/TLS configuration.'
  },
  27017: {
    port: 27017,
    service: 'MongoDB',
    description: 'MongoDB database server',
    risk: 'high',
    recommendation: 'Never expose publicly. Enable authentication, use firewall rules.'
  }
};

// Common port lists for different scan types
export const SCAN_PRESETS = {
  quick: [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 8080, 27017],
  standard: [
    20, 21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445, 465, 587, 993, 995,
    1433, 1521, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 27017
  ],
  full: Array.from({ length: 100 }, (_, i) => i + 1)
};

export const getPortInfo = (port: number): PortInfo => {
  return PORT_DATABASE[port] || {
    port,
    service: 'Unknown',
    description: 'No information available for this port',
    risk: 'low',
    recommendation: 'Research this port number for potential security implications.'
  };
};
