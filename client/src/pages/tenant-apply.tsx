import React, { useState } from "react";
import { PublicLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, CheckCircle2 } from "lucide-react";

export default function TenantApply() {
  const [step, setStep] = useState(1);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s <= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                  data-testid={`step-indicator-${s}`}
                >
                  {s}
                </div>
                <p className="text-xs mt-2 text-gray-600 text-center">
                  {s === 1 && "Personal"}
                  {s === 2 && "Employment"}
                  {s === 3 && "Documents"}
                  {s === 4 && "Consent"}
                </p>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Apply for Rental Property</CardTitle>
              <CardDescription>Complete your application in 4 steps</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4" data-testid="form-step-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" data-testid="input-first-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" data-testid="input-last-name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" data-testid="input-phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" data-testid="input-dob" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Current Address</Label>
                    <Input id="address" placeholder="123 Main St, City, State" data-testid="input-address" />
                  </div>
                </div>
              )}

              {/* Step 2: Employment */}
              {step === 2 && (
                <div className="space-y-4" data-testid="form-step-2">
                  <div className="space-y-2">
                    <Label htmlFor="employer">Employer Name</Label>
                    <Input id="employer" placeholder="Company Name" data-testid="input-employer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" placeholder="Your position" data-testid="input-job-title" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Employment Start Date</Label>
                      <Input id="startDate" type="date" data-testid="input-employment-start" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Annual Income</Label>
                      <Input id="salary" type="number" placeholder="75000" data-testid="input-annual-income" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empContact">Employer Contact</Label>
                    <Input id="empContact" type="email" placeholder="hr@company.com" data-testid="input-employer-contact" />
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {step === 3 && (
                <div className="space-y-4" data-testid="form-step-3">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors" data-testid="upload-government-id">
                    <FileUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium mb-1">Government ID</p>
                    <p className="text-sm text-muted-foreground mb-4">Upload a copy of your driver's license or passport</p>
                    <Button variant="outline" size="sm">Choose File</Button>
                  </div>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors" data-testid="upload-income-verification">
                    <FileUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium mb-1">Income Verification</p>
                    <p className="text-sm text-muted-foreground mb-4">Recent pay stub or tax return</p>
                    <Button variant="outline" size="sm">Choose File</Button>
                  </div>
                </div>
              )}

              {/* Step 4: Consent */}
              {step === 4 && (
                <div className="space-y-4" data-testid="form-step-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3 text-sm">
                    <label className="flex items-start gap-3 cursor-pointer" data-testid="checkbox-consent-screening">
                      <Checkbox id="consent1" className="mt-1" />
                      <span>I authorize IKON to conduct a background check, credit report, and employment verification as required by fair housing laws.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer" data-testid="checkbox-consent-fair-housing">
                      <Checkbox id="consent2" className="mt-1" />
                      <span>I understand this application is subject to FCRA compliance and Fair Housing Act requirements.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer" data-testid="checkbox-consent-accuracy">
                      <Checkbox id="consent3" className="mt-1" />
                      <span>I certify that all information provided is accurate and complete.</span>
                    </label>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center gap-3 text-green-700 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5" />
                    All required consents obtained
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)} data-testid="button-previous">
                    Previous
                  </Button>
                )}
                {step < 4 ? (
                  <Button className="flex-1" onClick={() => setStep(step + 1)} data-testid="button-next">
                    Next
                  </Button>
                ) : (
                  <Button className="flex-1" data-testid="button-submit-application">
                    Submit Application
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}