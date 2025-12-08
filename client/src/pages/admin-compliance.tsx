import React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Clock, FileCheck, Shield, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const complianceItems = [
  { id: 1, name: "FCRA Consent Tracking", status: "compliant", percentage: 100, lastAudited: "Dec 1, 2025" },
  { id: 2, name: "Data Privacy (CCPA)", status: "compliant", percentage: 100, lastAudited: "Nov 28, 2025" },
  { id: 3, name: "Fair Housing Act Compliance", status: "compliant", percentage: 100, lastAudited: "Nov 25, 2025" },
  { id: 4, name: "Payment Processing (PCI-DSS)", status: "compliant", percentage: 100, lastAudited: "Dec 5, 2025" },
  { id: 5, name: "Security Audit", status: "in-progress", percentage: 75, lastAudited: "Dec 1, 2025" },
];

const auditLog = [
  { id: 1, event: "FCRA Consent Form Updated", date: "Dec 5, 2025 2:45 PM", user: "Admin System", status: "success" },
  { id: 2, event: "Privacy Policy Reviewed", date: "Dec 4, 2025 10:20 AM", user: "Legal Team", status: "success" },
  { id: 3, event: "Data Export Request", date: "Dec 3, 2025 3:15 PM", user: "Compliance Officer", status: "completed" },
  { id: 4, event: "Screening Vendor Audit", date: "Dec 1, 2025 9:30 AM", user: "Vendor Management", status: "success" },
];

export default function AdminCompliance() {
  return (
    <DashboardLayout type="admin">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">Compliance & Legal</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Monitor regulatory compliance and audit trails</p>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-700">Compliance Score</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-900">98%</p>
                </div>
                <CheckCircle2 className="w-8 sm:w-12 h-8 sm:h-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-xl sm:text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Last Audit</p>
                  <p className="text-xs sm:text-sm font-bold">Dec 5, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="compliance" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-auto gap-1 sm:gap-0">
            <TabsTrigger value="compliance" className="text-xs sm:text-sm" data-testid="tab-compliance-status">Status</TabsTrigger>
            <TabsTrigger value="audit" className="text-xs sm:text-sm" data-testid="tab-audit-log">Audit</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs sm:text-sm" data-testid="tab-compliance-docs">Docs</TabsTrigger>
          </TabsList>

          {/* Compliance Status */}
          <TabsContent value="compliance" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            {complianceItems.map((item) => (
              <Card key={item.id} data-testid={`card-compliance-${item.id}`}>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0 sm:mb-4">
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
                        <h3 className="font-bold text-sm sm:text-base" data-testid={`text-compliance-item-${item.id}`}>{item.name}</h3>
                        <Badge 
                          variant={item.status === "compliant" ? "default" : "secondary"}
                          className="text-[10px] sm:text-xs"
                          data-testid={`status-compliance-${item.id}`}
                        >
                          {item.status === "compliant" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {item.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={item.percentage} className="h-2" />
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Last audited: {item.lastAudited}</p>
                      </div>
                    </div>
                    <div className="flex sm:block items-center justify-between w-full sm:w-auto sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-primary">{item.percentage}%</p>
                      <Button variant="ghost" size="sm" className="h-8 text-xs sm:text-sm" data-testid={`button-review-compliance-${item.id}`}>
                        <Eye className="w-3 sm:w-4 h-3 sm:h-4 mr-1" /> Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Audit Log */}
          <TabsContent value="audit" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Audit Trail</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Complete log of compliance-related actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {auditLog.map((log) => (
                    <div key={log.id} className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors" data-testid={`log-entry-${log.id}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-xs sm:text-sm" data-testid={`text-audit-event-${log.id}`}>{log.event}</h4>
                        <Badge variant="outline" className="text-[10px] sm:text-xs" data-testid={`status-audit-${log.id}`}>{log.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                        <span data-testid={`text-audit-date-${log.id}`}>{log.date}</span>
                        <span>•</span>
                        <span data-testid={`text-audit-user-${log.id}`}>{log.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Compliance Documents</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Download templates and policies</CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Document</TableHead>
                        <TableHead className="text-xs">Version</TableHead>
                        <TableHead className="text-xs">Last Updated</TableHead>
                        <TableHead className="text-right text-xs">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">FCRA Disclosure Form</TableCell>
                        <TableCell className="text-xs sm:text-sm">v2.1</TableCell>
                        <TableCell className="text-xs sm:text-sm">Dec 1, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="button-download-fcra">Download</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Privacy Policy</TableCell>
                        <TableCell className="text-xs sm:text-sm">v3.0</TableCell>
                        <TableCell className="text-xs sm:text-sm">Nov 28, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="button-download-privacy">Download</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Terms of Service</TableCell>
                        <TableCell className="text-xs sm:text-sm">v2.5</TableCell>
                        <TableCell className="text-xs sm:text-sm">Nov 15, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="button-download-terms">Download</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-xs sm:text-sm">Fair Housing Policy</TableCell>
                        <TableCell className="text-xs sm:text-sm">v1.2</TableCell>
                        <TableCell className="text-xs sm:text-sm">Nov 10, 2025</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-xs" data-testid="button-download-housing">Download</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}