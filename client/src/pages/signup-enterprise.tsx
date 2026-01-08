import React, { useState } from "react";
import { PublicLayout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Link } from "wouter";
import { checkUsernameAvailability } from "@/lib/api";
import { enterpriseRegisterSchema } from "@/lib/validation";
import { useAuth } from "@/hooks/use-auth";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignUpEnterprise() {
  const { registerMutation } = useAuth();
  const [form, setForm] = useState({
    // Account Owner
    username: "",
    password: "",
    adminName: "",
    email: "",
    phone: "",

    // Organization Details
    orgName: "",
    orgType: "management_company",
    regions: "",
    unitsManaged: "",
    propertiesCount: "",
    timeInBusiness: "",

    // Operational Scope
    primaryUseCase: "internal",
    criticalModules: [] as string[],
    compliancePriorities: [] as string[],
    securityFeatures: [] as string[],
    anticipatedRoles: "",

    // Integrations
    existingSystems: [] as string[],
    existingSystemsOther: "",
    technicalContact: "",
    itResources: "dedicated",

    // Plan
    subscriptionPlan: "growth",
    initialSeats: "1",
    timelineToLaunch: "",

    // Consents
    consentTerms: false,
    consentMarketing: false,
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

  function onCheckboxGroupChange(group: "criticalModules" | "compliancePriorities" | "securityFeatures" | "existingSystems", value: string, checked: boolean) {
    setForm((f) => {
      const current = f[group];
      const updated = checked 
        ? [...current, value]
        : current.filter(item => item !== value);
      return { ...f, [group]: updated };
    });
  }

  function onCheckboxChange(name: string, checked: boolean) {
    setForm((f) => ({ ...f, [name]: checked }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = enterpriseRegisterSchema.safeParse({
      userType: "enterprise" as const,
      username: form.username,
      password: form.password,
      profile: {
        orgName: form.orgName,
        orgType: form.orgType,
        regions: form.regions,
        unitsManaged: form.unitsManaged ? Number(form.unitsManaged) : undefined,
        propertiesCount: form.propertiesCount ? Number(form.propertiesCount) : undefined,
        timeInBusiness: form.timeInBusiness || undefined,
        
        primaryUseCase: form.primaryUseCase,
        criticalModules: form.criticalModules,
        compliancePriorities: form.compliancePriorities,
        securityFeatures: form.securityFeatures,
        anticipatedRoles: form.anticipatedRoles || undefined,
        
        existingSystems: form.existingSystems,
        existingSystemsOther: form.existingSystemsOther || undefined,
        technicalContact: form.technicalContact || undefined,
        itResources: form.itResources,
        
        adminName: form.adminName,
        email: form.email,
        phone: form.phone,
        
        subscriptionPlan: form.subscriptionPlan,
        initialSeats: Number(form.initialSeats),
        timelineToLaunch: form.timelineToLaunch || undefined,
        
        consentFlags: {
          terms: form.consentTerms,
          marketing: form.consentMarketing,
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    registerMutation.mutate(parsed.data);
  }

  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Enterprise Admin Sign Up</h1>
            <p className="text-sm text-muted-foreground">Create your enterprise admin account to oversee syndicated listings, screening, payments, and multi-portfolio operations from one control center.</p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground list-disc pl-5">
              <li>End-to-end listing, screening, leasing, and payments.</li>
              <li>Configurable data separation and role-based access across portfolios.</li>
              <li>API-ready integrations with screening, payments, and listing aggregators.</li>
            </ul>
          </div>
          
          {(errors.form || registerMutation.error) && (
            <Alert role="alert" variant="destructive" className="mb-6">
              {errors.form || registerMutation.error?.message}
            </Alert>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-8">
            
            {/* Account Owner */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Account Owner</h2>
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
                  />
                  {usernameAvailable === false && <p className="text-destructive text-sm mt-1">Username taken</p>}
                  {errors.username && <p className="text-destructive text-sm mt-1">{errors.username}</p>}
                </div>
                <div>
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
                <div>
                  <Label htmlFor="adminName">Admin Name</Label>
                  <Input 
                    id="adminName" 
                    name="adminName" 
                    value={form.adminName} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.adminName"]}
                  />
                  {errors["profile.adminName"] && <p className="text-destructive text-sm mt-1">{errors["profile.adminName"]}</p>}
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
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel"
                    value={form.phone} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.phone"]}
                  />
                  {errors["profile.phone"] && <p className="text-destructive text-sm mt-1">{errors["profile.phone"]}</p>}
                </div>
              </div>
            </div>

            {/* Organization Details */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Organization Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input 
                    id="orgName" 
                    name="orgName" 
                    value={form.orgName} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.orgName"]}
                  />
                  {errors["profile.orgName"] && <p className="text-destructive text-sm mt-1">{errors["profile.orgName"]}</p>}
                </div>
                <div>
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select onValueChange={(v) => onSelectChange("orgType", v)} defaultValue="management_company">
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management_company">Property Management Company</SelectItem>
                      <SelectItem value="institutional">Institutional Owner/REIT</SelectItem>
                      <SelectItem value="brokerage">Brokerage with Management Arm</SelectItem>
                      <SelectItem value="corporate_housing">Corporate Housing / Coliving</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="regions">Regions / Markets Covered</Label>
                  <Input 
                    id="regions" 
                    name="regions" 
                    placeholder="e.g. CA, TX, NY"
                    value={form.regions} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.regions"]}
                  />
                  {errors["profile.regions"] && <p className="text-destructive text-sm mt-1">{errors["profile.regions"]}</p>}
                </div>
                <div>
                  <Label htmlFor="unitsManaged">Total Units Under Management</Label>
                  <Input 
                    id="unitsManaged" 
                    name="unitsManaged" 
                    type="number" 
                    min="0"
                    value={form.unitsManaged} 
                    onChange={onChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="propertiesCount">Number of Properties</Label>
                  <Input 
                    id="propertiesCount" 
                    name="propertiesCount" 
                    type="number" 
                    min="0"
                    value={form.propertiesCount} 
                    onChange={onChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="timeInBusiness">Time in Business</Label>
                  <Select onValueChange={(v) => onSelectChange("timeInBusiness", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<1y">&lt; 1 year</SelectItem>
                      <SelectItem value="1-3y">1-3 years</SelectItem>
                      <SelectItem value="3-5y">3-5 years</SelectItem>
                      <SelectItem value="5y+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Operational Scope & Modules */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Operational Scope</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Use Case</Label>
                  <RadioGroup onValueChange={(v) => onSelectChange("primaryUseCase", v)} defaultValue="internal">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="internal" id="use-internal" />
                      <Label htmlFor="use-internal" className="font-normal cursor-pointer">Internal portfolio management only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="resale" id="use-resale" />
                      <Label htmlFor="use-resale" className="font-normal cursor-pointer">SaaS resale to 3rd-party landlords</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="use-both" />
                      <Label htmlFor="use-both" className="font-normal cursor-pointer">Both internal & external portfolios</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Critical Modules</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      "Listing & Syndication", "Application & Screening", "Payments & Finance", 
                      "Lease & Document Management", "Tenant Mobile App", "Notifications & Messaging", 
                      "Billing & Subscription", "Integrations & APIs", "Analytics & Reporting"
                    ].map((mod) => (
                      <div key={mod} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`mod-${mod}`}
                          checked={form.criticalModules.includes(mod)}
                          onCheckedChange={(c) => onCheckboxGroupChange("criticalModules", mod, c as boolean)}
                        />
                        <Label htmlFor={`mod-${mod}`} className="font-normal cursor-pointer">{mod}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Compliance Priorities</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Fair Housing / FCRA", "Payments & Escrow", "Data Separation", "Audit Trails"].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`comp-${item}`}
                          checked={form.compliancePriorities.includes(item)}
                          onCheckedChange={(c) => onCheckboxGroupChange("compliancePriorities", item, c as boolean)}
                        />
                        <Label htmlFor={`comp-${item}`} className="font-normal cursor-pointer">{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Security Features</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Single Sign-On (SSO)", "Role-Based Access (RBAC)", "IP Allowlisting", "Audit Logging"].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sec-${item}`}
                          checked={form.securityFeatures.includes(item)}
                          onCheckedChange={(c) => onCheckboxGroupChange("securityFeatures", item, c as boolean)}
                        />
                        <Label htmlFor={`sec-${item}`} className="font-normal cursor-pointer">{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Integrations & Technical */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Integrations & Technical</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label>Existing Systems to Integrate</Label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Accounting (QuickBooks/NetSuite)", "Screening Providers", "Payment Gateway", "Listing Aggregators", "Internal BI / Data Warehouse"].map((sys) => (
                      <div key={sys} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sys-${sys}`}
                          checked={form.existingSystems.includes(sys)}
                          onCheckedChange={(c) => onCheckboxGroupChange("existingSystems", sys, c as boolean)}
                        />
                        <Label htmlFor={`sys-${sys}`} className="font-normal cursor-pointer">{sys}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="technicalContact">Technical Contact Email (Optional)</Label>
                  <Input 
                    id="technicalContact" 
                    name="technicalContact" 
                    type="email"
                    value={form.technicalContact} 
                    onChange={onChange} 
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="itResources">IT/Dev Resources</Label>
                  <Select onValueChange={(v) => onSelectChange("itResources", v)} defaultValue="dedicated">
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dedicated">Dedicated engineering team</SelectItem>
                      <SelectItem value="shared">Shared IT resources</SelectItem>
                      <SelectItem value="external">External agency</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Plan & Commitment */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Plan & Commitment</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
                  <Select onValueChange={(v) => onSelectChange("subscriptionPlan", v)} defaultValue="growth">
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="growth">Growth (up to 200 units)</SelectItem>
                      <SelectItem value="pro">Pro (201–1,000 units)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (1,001+ units)</SelectItem>
                      <SelectItem value="custom">Custom / Talk to Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="initialSeats">Initial Admin Seats</Label>
                  <Input 
                    id="initialSeats" 
                    name="initialSeats" 
                    type="number" 
                    min="1"
                    value={form.initialSeats} 
                    onChange={onChange} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">You can add more users later.</p>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="timelineToLaunch">Timeline to Launch</Label>
                  <Select onValueChange={(v) => onSelectChange("timelineToLaunch", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP / within 30 days</SelectItem>
                      <SelectItem value="1-3m">1–3 months</SelectItem>
                      <SelectItem value="3-6m">3–6 months</SelectItem>
                      <SelectItem value="exploring">Exploring options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Consents */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consentTerms" 
                  checked={form.consentTerms} 
                  onCheckedChange={(c) => onCheckboxChange("consentTerms", c as boolean)} 
                />
                <Label htmlFor="consentTerms" className="font-normal">
                  I am authorized to enter into agreements on behalf of this organization and agree to the <Link href="/terms"><span className="underline cursor-pointer">Terms of Service</span></Link> and <Link href="/privacy"><span className="underline cursor-pointer">Privacy Policy</span></Link>.
                </Label>
              </div>
              {errors["profile.consentFlags.terms"] && <p className="text-destructive text-sm ml-6">{errors["profile.consentFlags.terms"]}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consentMarketing" 
                  checked={form.consentMarketing} 
                  onCheckedChange={(c) => onCheckboxChange("consentMarketing", c as boolean)} 
                />
                <Label htmlFor="consentMarketing" className="font-normal">I agree to receive onboarding and product communication emails.</Label>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <Link href="/signup">
                <span className="text-sm font-medium underline cursor-pointer">Back</span>
              </Link>
              <Button type="submit" size="lg" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Creating..." : "Create Enterprise Admin Account"}
              </Button>
            </div>

          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
