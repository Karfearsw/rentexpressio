import React from "react";
import { MobileLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Wrench, 
  FileText, 
  Bell, 
  ChevronRight,
  Home,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function TenantPortal() {
  return (
    <MobileLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Hi, Alex</h1>
            <p className="text-sm text-gray-500">Unit 4B • Sunset Apts</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
            <img src="https://github.com/shadcn.png" alt="Profile" />
          </div>
        </div>

        {/* Rent Card */}
        <div className="relative overflow-hidden rounded-3xl bg-primary text-white shadow-xl p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
          
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">Rent Due</p>
            <h2 className="text-4xl font-bold mb-4">$2,450<span className="text-lg text-blue-200 font-normal">.00</span></h2>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm text-blue-100 bg-white/10 px-3 py-1 rounded-full">
                <Clock className="w-3 h-3" /> Due in 3 days
              </div>
            </div>

            <Button className="w-full bg-white text-primary hover:bg-gray-100 font-bold rounded-xl h-12 shadow-lg">
              Pay Now
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Wrench className="w-6 h-6" />
            </div>
            <span className="font-medium text-sm text-gray-700">Request Fix</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <span className="font-medium text-sm text-gray-700">Documents</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
            <span className="text-xs text-primary font-medium">View All</span>
          </div>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">Rent Payment</p>
                <p className="text-xs text-gray-500">Nov 01 • Auto-pay</p>
              </div>
              <span className="text-sm font-bold text-gray-900">-$2,450</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">Maintenance Request</p>
                <p className="text-xs text-gray-500">Oct 28 • HVAC Filter</p>
              </div>
              <Badge variant="secondary" className="text-xs">Closed</Badge>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Building Notice</p>
            <p className="text-xs text-blue-700 mt-1">Water will be shut off for maintenance on Tuesday from 10am-2pm.</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}