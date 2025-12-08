import React, { useState } from "react";
import { MobileLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const requests = [
  { id: 1, issue: "HVAC Filter Replacement", status: "closed", date: "Oct 28", priority: "Low" },
  { id: 2, issue: "Leaky Faucet - Bathroom", status: "in-progress", date: "Oct 25", priority: "Medium" },
  { id: 3, issue: "Door Lock Repair", status: "scheduled", date: "Oct 15", priority: "High" },
];

export default function TenantMaintenance() {
  const [showForm, setShowForm] = useState(false);

  return (
    <MobileLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">Maintenance</h1>
          <Button size="sm" data-testid="button-new-request" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-1" /> New
          </Button>
        </div>

        {showForm && (
          <Card data-testid="form-maintenance-request">
            <CardHeader>
              <CardTitle className="text-lg">Report an Issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Category</Label>
                <Select>
                  <SelectTrigger data-testid="select-issue-type">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="appliance">Appliance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger data-testid="select-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High - Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the issue..." 
                  className="min-h-24"
                  data-testid="textarea-issue-description"
                />
              </div>
              <Button className="w-full" data-testid="button-submit-request">Submit Request</Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} data-testid={`card-request-${req.id}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium" data-testid={`text-issue-${req.id}`}>{req.issue}</h3>
                  <Badge 
                    variant={
                      req.status === "closed" ? "secondary" : 
                      req.status === "in-progress" ? "default" : 
                      "outline"
                    }
                    data-testid={`status-request-${req.id}`}
                  >
                    {req.status === "closed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {req.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                    {req.status === "scheduled" && <AlertCircle className="w-3 h-3 mr-1" />}
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{req.date}</span>
                  <Badge variant="outline">{req.priority}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
