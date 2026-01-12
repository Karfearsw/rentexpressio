import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Megaphone,
  Globe,
  RefreshCcw,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Mail,
  Users
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Property, PropertySyndication } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface SyndicationWithDetails extends PropertySyndication {
  propertyName?: string;
  address?: string;
}

const SYNDICATION_PLATFORMS = [
  { id: "zillow", name: "Zillow", icon: "🏠", description: "Largest real estate marketplace" },
  { id: "apartments", name: "Apartments.com", icon: "🏢", description: "Top rental listing platform" },
  { id: "trulia", name: "Trulia", icon: "🏡", description: "Neighborhood-focused listings" },
  { id: "hotpads", name: "HotPads", icon: "🔥", description: "Map-based rental search" },
  { id: "realtor", name: "Realtor.com", icon: "🏘️", description: "Official realtor network" },
  { id: "facebook", name: "Facebook Marketplace", icon: "📱", description: "Social marketplace reach" }
];

export default function LandlordSyndication() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties, isLoading: loadingProps } = useQuery<Property[]>({
    queryKey: ["/api/properties"]
  });

  const { data: syndications, isLoading: loadingSynd } = useQuery<SyndicationWithDetails[]>({
    queryKey: ["/api/syndication"]
  });

  const toggleSyndicationMutation = useMutation({
    mutationFn: async ({ propertyId, platform, enabled }: { propertyId: string; platform: string; enabled: boolean }) => {
      return apiRequest("POST", "/api/syndication", { propertyId, platform, enabled: enabled ? "true" : "false" });
    },
    onSuccess: (_, { platform, enabled }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/syndication"] });
      toast({ 
        title: enabled ? "Platform enabled" : "Platform disabled",
        description: `Property listing ${enabled ? "will be synced to" : "removed from"} ${platform}`
      });
    }
  });

  const syncMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/syndication/${id}/sync`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/syndication"] });
      toast({ title: "Sync complete", description: "Listing has been updated on the platform." });
    }
  });

  const isLoading = loadingProps || loadingSynd;

  if (isLoading) {
    return (
      <DashboardLayout type="landlord">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const getSyndicationForProperty = (propertyId: string, platform: string) => {
    return syndications?.find(s => s.propertyId === propertyId && s.platform === platform);
  };

  const enabledCount = syndications?.filter(s => s.enabled === "true").length || 0;
  const syncedCount = syndications?.filter(s => s.status === "synced").length || 0;

  return (
    <DashboardLayout type="landlord">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Property Syndication</h1>
            <p className="text-sm text-muted-foreground">Market your properties across multiple listing platforms.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Available to list</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Globe className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enabledCount}</div>
              <p className="text-xs text-muted-foreground">Across all platforms</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Synced</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{syncedCount}</div>
              <p className="text-xs text-muted-foreground">Up to date</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platforms</CardTitle>
              <Megaphone className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{SYNDICATION_PLATFORMS.length}</div>
              <p className="text-xs text-muted-foreground">Available networks</p>
            </CardContent>
          </Card>
        </div>

        {properties?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Properties Yet</h3>
              <p className="text-muted-foreground mb-4">Add properties first to start syndicating them to listing platforms.</p>
              <Button onClick={() => window.location.href = "/landlord/properties"}>
                Add Properties
              </Button>
            </CardContent>
          </Card>
        ) : (
          properties?.map(property => (
            <Card key={property.id} className="overflow-hidden" data-testid={`card-property-${property.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {property.name}
                    </CardTitle>
                    <CardDescription>{property.address}, {property.city}, {property.state} {property.zip}</CardDescription>
                  </div>
                  <Badge variant={property.status === "Vacant" ? "destructive" : "default"}>
                    {property.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {SYNDICATION_PLATFORMS.map(platform => {
                    const syndication = getSyndicationForProperty(property.id, platform.id);
                    const isEnabled = syndication?.enabled === "true";
                    const isSynced = syndication?.status === "synced";

                    return (
                      <div 
                        key={platform.id} 
                        className={`p-4 rounded-lg border transition-all ${isEnabled ? "bg-primary/5 border-primary/20" : "bg-muted/30"}`}
                        data-testid={`toggle-${property.id}-${platform.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{platform.icon}</span>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => toggleSyndicationMutation.mutate({
                              propertyId: property.id,
                              platform: platform.id,
                              enabled: checked
                            })}
                          />
                        </div>
                        <p className="font-medium text-sm">{platform.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{platform.description}</p>
                        {isEnabled && (
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant={isSynced ? "default" : "outline"} className="text-xs">
                              {isSynced ? (
                                <><CheckCircle2 className="w-3 h-3 mr-1" /> Synced</>
                              ) : (
                                <><Clock className="w-3 h-3 mr-1" /> Pending</>
                              )}
                            </Badge>
                            {syndication && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2"
                                onClick={() => syncMutation.mutate(syndication.id)}
                                disabled={syncMutation.isPending}
                              >
                                <RefreshCcw className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Tenant Marketing Campaigns
            </CardTitle>
            <CardDescription>Send promotional emails to prospective tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
              <Users className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Email Campaign Feature</p>
                <p className="text-sm text-muted-foreground">
                  Connect an email service to send marketing campaigns to prospective tenants about your available properties.
                </p>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
