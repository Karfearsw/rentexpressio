import React, { useState } from "react";
import { PublicLayout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Link } from "wouter";
import { checkUsernameAvailability } from "@/lib/api";
import { tenantRegisterSchema } from "@/lib/validation";
import { useAuth } from "@/hooks/use-auth";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SignUpTenant() {
  const { registerMutation } = useAuth();
  const [form, setForm] = useState({
    // Account
    username: "",
    password: "",
    email: "",
    
    // Personal
    firstName: "",
    lastName: "",
    phone: "",
    
    // Preferences
    currentCity: "",
    currentState: "",
    desiredMoveInDate: undefined as Date | undefined,
    pets: false,
    petDetails: "",
    smoking: false,
    occupants: "1",
    preferredRentMax: "",
    preferredUnitSize: "",
    
    // Employment
    monthlyIncome: "",
    employmentStatus: "employed",
    employerName: "",
    jobTitle: "",
    timeAtJob: "",
    consentContactEmployer: false,
    
    // History
    residenceType: "renting",
    currentLandlordName: "",
    currentLandlordContact: "",
    timeAtAddress: "",
    reasonForMoving: "",
    
    // Consent
    consentMarketing: false,
    consentScreening: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  async function handleUsernameBlur() {
    if (!form.username) return;
    const available = await checkUsernameAvailability(form.username);
    setUsernameAvailable(available);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function onSelectChange(name: string, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onCheckboxChange(name: string, checked: boolean) {
    setForm((f) => ({ ...f, [name]: checked }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    
    if (!form.consentScreening) {
      setErrors({ consentScreening: "You must consent to screening to continue." });
      return;
    }

    const parsed = tenantRegisterSchema.safeParse({
      userType: "tenant" as const,
      username: form.username,
      password: form.password,
      profile: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        
        currentCity: form.currentCity,
        currentState: form.currentState,
        desiredMoveInDate: form.desiredMoveInDate?.toISOString(),
        pets: form.pets,
        petDetails: form.petDetails || undefined,
        smoking: form.smoking,
        occupants: parseInt(form.occupants) || 1,
        preferredRentMax: form.preferredRentMax ? Number(form.preferredRentMax) : undefined,
        preferredUnitSize: form.preferredUnitSize || undefined,
        
        monthlyIncome: Number(form.monthlyIncome),
        employmentStatus: form.employmentStatus,
        employerName: form.employerName || undefined,
        jobTitle: form.jobTitle || undefined,
        timeAtJob: form.timeAtJob || undefined,
        consentContactEmployer: form.consentContactEmployer,
        
        residenceType: form.residenceType,
        currentLandlordName: form.currentLandlordName || undefined,
        currentLandlordContact: form.currentLandlordContact || undefined,
        timeAtAddress: form.timeAtAddress || undefined,
        reasonForMoving: form.reasonForMoving || undefined,
        
        consentFlags: { 
          marketing: form.consentMarketing, 
          screening: form.consentScreening,
          screeningTimestamp: new Date().toISOString(),
        },
      },
    });

    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path.join(".") || "form";
        newErrors[key] = i.message;
      });
      setErrors(newErrors);
      // Scroll to top error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    registerMutation.mutate(parsed.data);
  }

  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Create Tenant Profile</h1>
          <p className="text-sm text-muted-foreground mb-8">Complete your profile to unlock one-click applications and fast screening.</p>
          
          {(errors.form || registerMutation.error) && (
            <Alert role="alert" variant="destructive" className="mb-6">
              {errors.form || registerMutation.error?.message}
            </Alert>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-8">
            
            {/* Account Details */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Account Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username" 
                    value={form.username} 
                    onChange={onChange} 
                    onBlur={handleUsernameBlur}
                    aria-invalid={!!errors.username}
                    aria-describedby="username-error"
                  />
                  {usernameAvailable === false && <p className="text-destructive text-sm mt-1">Username taken</p>}
                  {errors.username && <p id="username-error" className="text-destructive text-sm mt-1">{errors.username}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={form.email} 
                    onChange={onChange}
                    aria-invalid={!!errors["profile.email"]}
                  />
                  {errors["profile.email"] && <p className="text-destructive text-sm mt-1">{errors["profile.email"]}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={form.password} 
                    onChange={onChange}
                    aria-describedby="password-help"
                  />
                  <p id="password-help" className="text-xs text-muted-foreground mt-1">Minimum 8 characters, include at least one number and one letter.</p>
                  {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={form.firstName} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.firstName"]}
                  />
                  {errors["profile.firstName"] && <p className="text-destructive text-sm mt-1">{errors["profile.firstName"]}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={form.lastName} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.lastName"]}
                  />
                  {errors["profile.lastName"] && <p className="text-destructive text-sm mt-1">{errors["profile.lastName"]}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel"
                    value={form.phone} 
                    onChange={onChange} 
                    placeholder="(555) 123-4567"
                    aria-invalid={!!errors["profile.phone"]}
                  />
                  {errors["profile.phone"] && <p className="text-destructive text-sm mt-1">{errors["profile.phone"]}</p>}
                </div>
              </div>
            </div>

            {/* Rental Preferences */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Rental Preferences</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentCity">Current City</Label>
                  <Input 
                    id="currentCity" 
                    name="currentCity" 
                    value={form.currentCity} 
                    onChange={onChange} 
                  />
                  {errors["profile.currentCity"] && <p className="text-destructive text-sm mt-1">{errors["profile.currentCity"]}</p>}
                </div>
                <div>
                  <Label htmlFor="currentState">State</Label>
                  <Input 
                    id="currentState" 
                    name="currentState" 
                    value={form.currentState} 
                    onChange={onChange} 
                    placeholder="e.g. CA"
                    maxLength={2}
                  />
                  {errors["profile.currentState"] && <p className="text-destructive text-sm mt-1">{errors["profile.currentState"]}</p>}
                </div>
                <div>
                  <Label>Desired Move-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.desiredMoveInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.desiredMoveInDate ? format(form.desiredMoveInDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.desiredMoveInDate}
                        onSelect={(d) => setForm(f => ({ ...f, desiredMoveInDate: d }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors["profile.desiredMoveInDate"] && <p className="text-destructive text-sm mt-1">{errors["profile.desiredMoveInDate"]}</p>}
                </div>
                <div>
                  <Label htmlFor="preferredRentMax">Max Monthly Rent ($)</Label>
                  <Input 
                    id="preferredRentMax" 
                    name="preferredRentMax" 
                    type="number" 
                    value={form.preferredRentMax} 
                    onChange={onChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="occupants">Number of Occupants</Label>
                  <Input 
                    id="occupants" 
                    name="occupants" 
                    type="number" 
                    min="1"
                    value={form.occupants} 
                    onChange={onChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="preferredUnitSize">Unit Size</Label>
                  <Select onValueChange={(v) => onSelectChange("preferredUnitSize", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="1bd">1 Bedroom</SelectItem>
                      <SelectItem value="2bd">2 Bedrooms</SelectItem>
                      <SelectItem value="3bd+">3+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox 
                    id="pets" 
                    checked={form.pets} 
                    onCheckedChange={(c) => onCheckboxChange("pets", c as boolean)} 
                  />
                  <Label htmlFor="pets">I have pets</Label>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox 
                    id="smoking" 
                    checked={form.smoking} 
                    onCheckedChange={(c) => onCheckboxChange("smoking", c as boolean)} 
                  />
                  <Label htmlFor="smoking">I smoke</Label>
                </div>
                {form.pets && (
                  <div className="sm:col-span-2">
                    <Label htmlFor="petDetails">Pet Details</Label>
                    <Input 
                      id="petDetails" 
                      name="petDetails" 
                      placeholder="Type, breed, and weight..." 
                      value={form.petDetails} 
                      onChange={onChange} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Income & Employment */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Income & Employment</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                  <Input 
                    id="monthlyIncome" 
                    name="monthlyIncome" 
                    type="number" 
                    value={form.monthlyIncome} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.monthlyIncome"]}
                  />
                  {errors["profile.monthlyIncome"] && <p className="text-destructive text-sm mt-1">{errors["profile.monthlyIncome"]}</p>}
                </div>
                <div>
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select onValueChange={(v) => onSelectChange("employmentStatus", v)} defaultValue="employed">
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(form.employmentStatus === "employed" || form.employmentStatus === "self-employed") && (
                  <>
                    <div>
                      <Label htmlFor="employerName">Employer Name</Label>
                      <Input 
                        id="employerName" 
                        name="employerName" 
                        value={form.employerName} 
                        onChange={onChange} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input 
                        id="jobTitle" 
                        name="jobTitle" 
                        value={form.jobTitle} 
                        onChange={onChange} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeAtJob">Time at Job</Label>
                      <Select onValueChange={(v) => onSelectChange("timeAtJob", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<6m">&lt; 6 months</SelectItem>
                          <SelectItem value="6-12m">6-12 months</SelectItem>
                          <SelectItem value="1-3y">1-3 years</SelectItem>
                          <SelectItem value="3y+">3+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox 
                        id="consentContactEmployer" 
                        checked={form.consentContactEmployer} 
                        onCheckedChange={(c) => onCheckboxChange("consentContactEmployer", c as boolean)} 
                      />
                      <Label htmlFor="consentContactEmployer">Consent to contact employer</Label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rental History */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Rental History</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="residenceType">Current Residence</Label>
                  <Select onValueChange={(v) => onSelectChange("residenceType", v)} defaultValue="renting">
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="renting">Renting</SelectItem>
                      <SelectItem value="own">Own</SelectItem>
                      <SelectItem value="family">Living with family</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeAtAddress">Time at Address</Label>
                  <Select onValueChange={(v) => onSelectChange("timeAtAddress", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<6m">&lt; 6 months</SelectItem>
                      <SelectItem value="6-12m">6-12 months</SelectItem>
                      <SelectItem value="1-3y">1-3 years</SelectItem>
                      <SelectItem value="3y+">3+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.residenceType === "renting" && (
                  <>
                    <div>
                      <Label htmlFor="currentLandlordName">Current Landlord Name</Label>
                      <Input 
                        id="currentLandlordName" 
                        name="currentLandlordName" 
                        value={form.currentLandlordName} 
                        onChange={onChange} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentLandlordContact">Landlord Phone/Email</Label>
                      <Input 
                        id="currentLandlordContact" 
                        name="currentLandlordContact" 
                        value={form.currentLandlordContact} 
                        onChange={onChange} 
                      />
                    </div>
                  </>
                )}
                <div className="sm:col-span-2">
                  <Label htmlFor="reasonForMoving">Reason for Moving</Label>
                  <Input 
                    id="reasonForMoving" 
                    name="reasonForMoving" 
                    value={form.reasonForMoving} 
                    onChange={onChange} 
                  />
                </div>
              </div>
            </div>

            {/* Consent & Communication */}
            <div className="space-y-6 pb-4">
              <h2 className="text-xl font-semibold">Consent & Terms</h2>
              
              <div className="bg-muted/30 p-4 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="consentScreening" 
                    checked={form.consentScreening} 
                    onCheckedChange={(c) => onCheckboxChange("consentScreening", c as boolean)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="consentScreening" className="font-medium">
                      I consent to background screening
                    </Label>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      I authorize IKON and participating landlords to obtain consumer reports (including credit, eviction, and background checks) for housing purposes, in compliance with the Fair Credit Reporting Act (FCRA). <Link href="/screening-policy"><span className="text-primary hover:underline cursor-pointer">View Screening Policy</span></Link>
                    </p>
                  </div>
                </div>
                {errors.consentScreening && <p className="text-destructive text-sm mt-2 ml-7">{errors.consentScreening}</p>}
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="consentMarketing" 
                  checked={form.consentMarketing} 
                  onCheckedChange={(c) => onCheckboxChange("consentMarketing", c as boolean)} 
                />
                <Label htmlFor="consentMarketing" className="font-normal">I agree to receive product updates and marketing emails</Label>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4">
              <p className="text-xs text-center text-muted-foreground mb-4">
                By creating an account, you agree to our <Link href="/terms"><span className="underline cursor-pointer">Terms of Service</span></Link> and <Link href="/privacy"><span className="underline cursor-pointer">Privacy Policy</span></Link>.
              </p>
              <div className="flex items-center justify-between gap-4">
                <Link href="/signup">
                  <span className="text-sm font-medium underline cursor-pointer">Back</span>
                </Link>
                <Button type="submit" size="lg" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? "Creating..." : "Create Tenant Account"}
                </Button>
              </div>
            </div>

          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
