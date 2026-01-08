import React from "react";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Building2, ShieldCheck } from "lucide-react";

export default function SignUpSelect() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold">Create your account</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Select the option that best describes you</p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <RoleCard
            icon={<Users className="w-6 h-6" aria-hidden="true" />}
            title="Tenant"
            description="Renters applying for a unit, paying rent, and managing maintenance."
            href="/signup/tenant"
          />
          <RoleCard
            icon={<Building2 className="w-6 h-6" aria-hidden="true" />}
            title="Landlord"
            description="Owners and property managers overseeing listings, tenants, and payments."
            href="/signup/landlord"
          />
          <RoleCard
            icon={<ShieldCheck className="w-6 h-6" aria-hidden="true" />}
            title="Enterprise/Admin"
            description="Enterprise administrators managing users, compliance, and organization settings."
            href="/signup/enterprise"
          />
        </div>
        <div className="text-center mt-6">
          <Link href="/">
            <a className="text-sm text-primary underline" aria-label="Back to home">Back to Home</a>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

function RoleCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Card className="p-6 sm:p-8 flex flex-col gap-3" aria-labelledby={`${title}-title`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
          {icon}
        </div>
        <h2 id={`${title}-title`} className="text-lg sm:text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      <div className="mt-2">
        <Link href={href}>
          <Button className="w-full" aria-label={`Continue as ${title}`}>Continue</Button>
        </Link>
      </div>
    </Card>
  );
}

