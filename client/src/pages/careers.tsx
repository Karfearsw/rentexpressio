import React from "react";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";

export default function CareersPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4">Careers</h1>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">We're not hiring yet, but we're growing fast. Drop us a note at careers@ikonpropertygroup.com if you're passionate about prop tech.</p>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
