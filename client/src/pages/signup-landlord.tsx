import React, { useState } from "react";
import { PublicLayout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Link } from "wouter";
import { checkUsernameAvailability } from "@/lib/api";
import { landlordRegisterSchema } from "@/lib/validation";
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

export default function SignUpLandlord() {
  const { registerMutation } = useAuth();
  const [form, setForm] = useState({
    // Account
    username: "",
    password: "",
    email: "",

    // Company & Contact
    companyName: "",
    contactName: "",
    phone: "",
    roleType: "individual",
    website: "",
    country: "",
    state: "",
    timeInBusiness: "",

    // Portfolio
    portfolioSize: "", // Units Under Management
    propertiesManaged: "", // Number of Properties
    propertyTypes: [] as string[],
    averageRent: "",

    // Goals
    primaryGoal: "",
    mustHaveFeatures: [] as string[],
    currentTools: "",
    planInterest: "",

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

  function onCheckboxGroupChange(group: "propertyTypes" | "mustHaveFeatures", value: string, checked: boolean) {
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

    const parsed = landlordRegisterSchema.safeParse({
      userType: "landlord" as const,
      username: form.username,
      password: form.password,
      profile: {
        companyName: form.companyName,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        roleType: form.roleType,
        website: form.website || undefined,
        country: form.country,
        state: form.state,
        timeInBusiness: form.timeInBusiness || undefined,
        
        portfolioSize: form.portfolioSize ? Number(form.portfolioSize) : undefined,
        propertiesManaged: form.propertiesManaged ? Number(form.propertiesManaged) : undefined,
        propertyTypes: form.propertyTypes,
        averageRent: form.averageRent || undefined,
        
        primaryGoal: form.primaryGoal || undefined,
        mustHaveFeatures: form.mustHaveFeatures,
        currentTools: form.currentTools || undefined,
        planInterest: form.planInterest || undefined,
        
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
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">Landlord Sign Up</h1>
          <p className="text-sm text-muted-foreground mb-8">You’ll get a 14-day free trial with full access to rent collection, maintenance, and tenant tools.</p>
          
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
                  />
                  {usernameAvailable === false && <p className="text-destructive text-sm mt-1">Username taken</p>}
                  {errors.username && <p className="text-destructive text-sm mt-1">{errors.username}</p>}
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

            {/* Company & Contact */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Company & Contact</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={form.companyName} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.companyName"]}
                  />
                  {errors["profile.companyName"] && <p className="text-destructive text-sm mt-1">{errors["profile.companyName"]}</p>}
                </div>
                <div>
                  <Label htmlFor="roleType">Role Type</Label>
                  <Select onValueChange={(v) => onSelectChange("roleType", v)} defaultValue="individual">
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Landlord</SelectItem>
                      <SelectItem value="management_company">Property Management Company</SelectItem>
                      <SelectItem value="investment_group">Real Estate Investment Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input 
                    id="contactName" 
                    name="contactName" 
                    value={form.contactName} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.contactName"]}
                  />
                  {errors["profile.contactName"] && <p className="text-destructive text-sm mt-1">{errors["profile.contactName"]}</p>}
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
                <div className="sm:col-span-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    type="url"
                    placeholder="https://"
                    value={form.website} 
                    onChange={onChange} 
                  />
                  {errors["profile.website"] && <p className="text-destructive text-sm mt-1">{errors["profile.website"]}</p>}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    name="country" 
                    value={form.country} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.country"]}
                  />
                  {errors["profile.country"] && <p className="text-destructive text-sm mt-1">{errors["profile.country"]}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State/Region</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={form.state} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.state"]}
                  />
                  {errors["profile.state"] && <p className="text-destructive text-sm mt-1">{errors["profile.state"]}</p>}
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

            {/* Portfolio & Properties */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Portfolio & Properties</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="portfolioSize">Total Units Under Management</Label>
                  <Input 
                    id="portfolioSize" 
                    name="portfolioSize" 
                    type="number" 
                    min="0"
                    value={form.portfolioSize} 
                    onChange={onChange} 
                    aria-invalid={!!errors["profile.portfolioSize"]}
                  />
                </div>
                <div>
                  <Label htmlFor="propertiesManaged">Number of Properties</Label>
                  <Input 
                    id="propertiesManaged" 
                    name="propertiesManaged" 
                    type="number" 
                    min="0"
                    value={form.propertiesManaged} 
                    onChange={onChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="averageRent">Avg Monthly Rent per Unit ($)</Label>
                  <Input 
                    id="averageRent" 
                    name="averageRent" 
                    type="number" 
                    value={form.averageRent} 
                    onChange={onChange} 
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Typical Property Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Single-family", "Small multifamily (2-4)", "Large multifamily (5+)", "Mixed-use", "Commercial", "Student housing"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`}
                          checked={form.propertyTypes.includes(type)}
                          onCheckedChange={(c) => onCheckboxGroupChange("propertyTypes", type, c as boolean)}
                        />
                        <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Goals & Plan */}
            <div className="space-y-4 border-b pb-8">
              <h2 className="text-xl font-semibold">Goals & Plan</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Goal</Label>
                  <RadioGroup onValueChange={(v) => onSelectChange("primaryGoal", v)}>
                    {["Automate rent collection", "Streamline maintenance", "Simplify leasing & screening", "Improve reporting", "All of the above"].map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <RadioGroupItem value={goal} id={`goal-${goal}`} />
                        <Label htmlFor={`goal-${goal}`} className="font-normal cursor-pointer">{goal}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Must-have Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Automated Payments", "Maintenance Orders", "Tenant Screening", "Syndicated Listings", "Owner Reporting", "Tenant Portal"].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`feature-${feature}`}
                          checked={form.mustHaveFeatures.includes(feature)}
                          onCheckedChange={(c) => onCheckboxGroupChange("mustHaveFeatures", feature, c as boolean)}
                        />
                        <Label htmlFor={`feature-${feature}`} className="font-normal cursor-pointer">{feature}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentTools">Current Management Method</Label>
                  <Select onValueChange={(v) => onSelectChange("currentTools", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spreadsheets">Spreadsheets</SelectItem>
                      <SelectItem value="other_software">Other software</SelectItem>
                      <SelectItem value="manual">Manual (paper/email)</SelectItem>
                      <SelectItem value="mix">Mix of tools</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planInterest">Plan Interest</Label>
                  <Select onValueChange={(v) => onSelectChange("planInterest", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Just trying this out (demo)</SelectItem>
                      <SelectItem value="10-50">Ready to move 10-50 units</SelectItem>
                      <SelectItem value="51-200">Ready to move 51-200 units</SelectItem>
                      <SelectItem value="200+">Ready to move 200+ units (enterprise)</SelectItem>
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
                  By creating an account, you agree to our <Link href="/terms"><span className="underline cursor-pointer">Terms of Service</span></Link> and <Link href="/privacy"><span className="underline cursor-pointer">Privacy Policy</span></Link>.
                </Label>
              </div>
              {errors["profile.consentFlags.terms"] && <p className="text-destructive text-sm ml-6">{errors["profile.consentFlags.terms"]}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consentMarketing" 
                  checked={form.consentMarketing} 
                  onCheckedChange={(c) => onCheckboxChange("consentMarketing", c as boolean)} 
                />
                <Label htmlFor="consentMarketing" className="font-normal">I agree to receive product updates and marketing emails.</Label>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <Link href="/signup">
                <span className="text-sm font-medium underline cursor-pointer">Back</span>
              </Link>
              <Button type="submit" size="lg" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Creating..." : "Create Landlord Account"}
              </Button>
            </div>

          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
