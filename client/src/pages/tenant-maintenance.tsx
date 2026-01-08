import React, { useState } from "react";
import { TenantLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Clock, CheckCircle2, AlertCircle, Wrench, Calendar, User } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MaintenanceRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function TenantMaintenance() {
  const { toast } = useToast();
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  
  const [category, setCategory] = useState<string>("");
  const [priority, setPriority] = useState<string>("normal");
  const [description, setDescription] = useState<string>("");

  const { data: requests, isLoading } = useQuery<MaintenanceRequest[]>({ queryKey: ["/api/maintenance"] });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/maintenance", {
        category,
        description,
        priority,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance"] });
      setCategory("");
      setPriority("normal");
      setDescription("");
      setShowNewRequest(false);
      toast({
        title: "Request Submitted",
        description: "Your maintenance request has been received.",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "closed":
      case "resolved":
        return <Badge variant="secondary"><CheckCircle2 className="w-3 h-3 mr-1" /> Resolved</Badge>;
      case "in_progress":
        return <Badge><Clock className="w-3 h-3 mr-1" /> In Progress</Badge>;
      case "open":
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" /> Open</Badge>;
    }
  };

  return (
    <TenantLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">Maintenance</h1>
          <Button onClick={() => setShowNewRequest(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Request
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoading && (
            <Card><CardContent className="py-6">Loading requests...</CardContent></Card>
          )}
          {!isLoading && (!requests || requests.length === 0) && (
            <Card>
              <CardContent className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Wrench className="w-12 h-12 mb-4 opacity-20" />
                <p>No maintenance requests yet.</p>
                <Button variant="link" onClick={() => setShowNewRequest(true)}>Create one now</Button>
              </CardContent>
            </Card>
          )}
          {requests?.map((req) => (
            <Card 
              key={req.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedRequest(req)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{req.description}</h3>
                      <Badge variant="outline" className="capitalize">{req.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(req.createdAt || "").toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> Assigned: {req.status === 'in_progress' ? 'Joe (Tech)' : 'Pending'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">{req.priority}</Badge>
                    {getStatusBadge(req.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Request Modal */}
        <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Maintenance Request</DialogTitle>
              <DialogDescription>
                Submit a new maintenance request for your unit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please describe the issue in detail..." 
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewRequest(false)}>Cancel</Button>
              <Button onClick={() => createMutation.mutate()} disabled={!category || !description || createMutation.isPending}>
                {createMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Request Details Modal */}
        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <div className="flex items-center gap-2 pt-1">
                {selectedRequest && getStatusBadge(selectedRequest.status)}
                <Badge variant="outline" className="capitalize">{selectedRequest?.priority} Priority</Badge>
              </div>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                  <p className="text-base">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                    <div className="capitalize">{selectedRequest.category}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Created On</h4>
                    <div>{new Date(selectedRequest.createdAt || "").toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Assigned To</h4>
                    <div>{selectedRequest.status === 'in_progress' ? 'Joe (HVAC Tech)' : 'Pending Assignment'}</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">Unit</h4>
                    <div>Unit 4B</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Updates</h4>
                  <div className="relative pl-4 border-l-2 border-muted space-y-4">
                    <div className="text-sm">
                      <div className="font-medium">Request Received</div>
                      <div className="text-muted-foreground text-xs">{new Date(selectedRequest.createdAt || "").toLocaleString()}</div>
                    </div>
                    {selectedRequest.status === 'in_progress' && (
                      <div className="text-sm">
                        <div className="font-medium">Technician Assigned</div>
                        <div className="text-muted-foreground text-xs">Joe (HVAC Tech) was assigned to this request.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TenantLayout>
  );
}
