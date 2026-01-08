import React from "react";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Tier({ title, price, features, cta }: { title: string; price: string; features: string[]; cta: string }) {
  return (
    <Card className="p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-3xl font-heading font-bold mt-1">{price}</p>
      </div>
      <ul className="text-sm text-muted-foreground space-y-2">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
      <Button className="mt-auto w-full">{cta}</Button>
    </Card>
  );
}

export default function PricingPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold">Simple, transparent pricing</h1>
            <p className="text-sm text-muted-foreground">14-day free trial • No credit card required</p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <Tier
              title="Growth"
              price="$199/mo"
              features={["Up to 50 units", "Rent Collection", "Maintenance", "Tenant Portal", "Basic Reporting", "Email Support"]}
              cta="Get Started"
            />
            <Tier
              title="Pro"
              price="$499/mo"
              features={["51–200 units", "Everything in Growth", "Owner Reports", "Lease Management", "Priority Support"]}
              cta="Get Started"
            />
            <Tier
              title="Enterprise"
              price="Custom"
              features={["200+ units", "Everything in Pro", "SSO & RBAC", "API Access", "Audit Logs", "Dedicated CSM"]}
              cta="Contact Sales"
            />
          </div>
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-3">FAQ</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Q: Can I change plans later? A: Yes, upgrade anytime.</p>
              <p>Q: What payment methods? A: Credit card, ACH, wire.</p>
              <p>Q: Is there a setup fee? A: No, get started immediately.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
