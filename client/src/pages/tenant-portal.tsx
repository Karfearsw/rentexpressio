import React from "react";
import { Link } from "wouter";
import { TenantLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  FileText, 
  Clock,
  CheckCircle2,
  PhoneCall
} from "lucide-react";

export default function TenantPortal() {
  return (
    <TenantLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold">Welcome back, Alex</h1>
            <p className="text-sm text-muted-foreground">Last login: Dec 8, 2025 9:30 AM</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Lease</CardTitle>
            <CardDescription>Sunset Boulevard Apartments • Unit 4B</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">123 Main Street, Orlando, FL 32801</div>
            <div className="text-sm">Lease Period: Jan 15, 2024 - Jan 14, 2025</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Landlord: ABC Property Management</Badge>
              <Badge variant="secondary" className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> (555) 123-4567</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/tenant/documents">
                <Button variant="outline">View Lease Document</Button>
              </Link>
              <Button onClick={() => window.location.href = "mailto:landlord@example.com"}>Contact Landlord</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rent Payment</CardTitle>
              <CardDescription>Next payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">Next Payment Due: January 15, 2025</div>
              <div className="text-2xl font-bold">$1,500</div>
              <div className="flex gap-2">
                <Link href="/tenant/pay">
                  <Button>Pay Now</Button>
                </Link>
                <Link href="/tenant/pay">
                  <Button variant="outline">View History</Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Autopay</Badge>
                <span className="text-sm text-muted-foreground">Enabled</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>Open requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">AC not cooling</div>
                  <div className="text-sm text-muted-foreground">Status: In Progress • Assigned: Joe (HVAC Tech)</div>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Kitchen light out</div>
                  <div className="text-sm text-muted-foreground">Status: Scheduled</div>
                </div>
                <Badge variant="secondary">Scheduled</Badge>
              </div>
              <div className="pt-2">
                <Link href="/tenant/maintenance">
                  <Button variant="outline">Submit New Request</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Your files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Lease Agreement.pdf</div>
              <Button variant="outline">Download</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Move-in Checklist.pdf</div>
              <Button variant="outline">Download</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Rent Receipt - December 2024.pdf</div>
              <Button variant="outline">Download</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Community Rules.pdf</div>
              <Button variant="outline">Download</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>Rent reminder: Payment due in 7 days</div>
              <Badge variant="outline">Reminder</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>Maintenance update: HVAC tech scheduled for tomorrow</div>
              <Badge variant="outline">Update</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>Lease renewal notice: Renew before Nov 15</div>
              <Badge variant="outline">Action</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  );
}
