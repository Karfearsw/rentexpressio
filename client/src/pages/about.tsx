import React from "react";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">About IKON</h1>
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Mission</h2>
              <p className="text-sm text-muted-foreground">To simplify property operations and maximize ROI through modern tools for listings, screening, leasing, payments, and maintenance.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Values</h2>
              <p className="text-sm text-muted-foreground">Transparency, efficiency, and compliance. We design with landlords and tenants in mind.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Why We Built This</h2>
              <p className="text-sm text-muted-foreground">Legacy software is complex and slow. IKON offers a focused, modern alternative that reduces rent friction, accelerates maintenance, and organizes leases.</p>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
