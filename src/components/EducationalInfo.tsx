import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Shield, Network, AlertCircle } from 'lucide-react';

export const EducationalInfo = () => {
  return (
    <Card className="p-6 border-primary/20 bg-card/50">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Learn About Port Scanning</h3>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="what-is-port" className="border-primary/20">
          <AccordionTrigger className="text-foreground hover:text-primary">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              What is a Port?
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-3">
              A port is like a virtual door on a computer that allows different programs and services to communicate over a network. Think of an IP address as a building address, and ports as individual apartment numbers within that building.
            </p>
            <p className="mb-3">
              Port numbers range from 0 to 65535:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>0-1023</strong>: Well-known ports (HTTP, HTTPS, FTP, SSH)</li>
              <li><strong>1024-49151</strong>: Registered ports (assigned by IANA)</li>
              <li><strong>49152-65535</strong>: Dynamic/private ports</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="why-scan" className="border-primary/20">
          <AccordionTrigger className="text-foreground hover:text-primary">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Why Scan Ports?
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-3">Port scanning serves several important purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Security Assessment</strong>: Identify unnecessary open ports that could be exploited by attackers
              </li>
              <li>
                <strong>Network Inventory</strong>: Discover what services are running on your network
              </li>
              <li>
                <strong>Troubleshooting</strong>: Verify that services are accessible when expected
              </li>
              <li>
                <strong>Compliance</strong>: Ensure network configurations meet security standards
              </li>
              <li>
                <strong>Penetration Testing</strong>: Ethical hackers use port scanning to find vulnerabilities
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="port-states" className="border-primary/20">
          <AccordionTrigger className="text-foreground hover:text-primary">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Port States Explained
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <strong className="text-success">OPEN</strong>
              </div>
              <p className="ml-4">
                The port is accepting connections. A service is actively listening and responding to requests. This could be intentional (web server on port 80) or a security risk (database exposed to internet).
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-destructive"></div>
                <strong className="text-destructive">CLOSED</strong>
              </div>
              <p className="ml-4">
                The port is accessible (not blocked by firewall) but no application is listening. The system responds that nothing is there. This is the most common and usually desired state for unused ports.
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-warning"></div>
                <strong className="text-warning">FILTERED</strong>
              </div>
              <p className="ml-4">
                A firewall, filter, or network obstacle is blocking access to the port. The scanner cannot determine if it's open or closed because responses are being blocked. This is often a good security practice.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="best-practices" className="border-primary/20">
          <AccordionTrigger className="text-foreground hover:text-primary">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Best Practices
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Close Unnecessary Ports</strong>: Only keep ports open that you actually need
              </li>
              <li>
                <strong>Use Firewalls</strong>: Filter traffic and block unauthorized access attempts
              </li>
              <li>
                <strong>Change Default Ports</strong>: Move services from well-known ports to custom ones
              </li>
              <li>
                <strong>Regular Scanning</strong>: Periodically scan your own network to detect changes
              </li>
              <li>
                <strong>Update Services</strong>: Keep all software on open ports up-to-date with security patches
              </li>
              <li>
                <strong>Use Encryption</strong>: Prefer encrypted protocols (HTTPS over HTTP, SSH over Telnet)
              </li>
              <li>
                <strong>Implement Authentication</strong>: Require strong authentication for all services
              </li>
              <li>
                <strong>Monitor Logs</strong>: Watch for suspicious connection attempts
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
