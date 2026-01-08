import React from "react";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ScreeningPolicyPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4">Tenant Screening Policy</h1>
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Consumer Reports</h2>
              <p className="text-sm text-muted-foreground">We obtain consumer reports such as credit, eviction, and criminal background checks with your consent.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Your Rights Under FCRA</h2>
              <p className="text-sm text-muted-foreground">You have rights to notice, access, and dispute inaccuracies. We follow the FCRA for all screening decisions.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">How Reports Are Used</h2>
              <p className="text-sm text-muted-foreground">Reports are used to evaluate rental applications and are not used for employment decisions.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Adverse Action Process</h2>
              <p className="text-sm text-muted-foreground">If an application is denied based on a report, we will provide required notices and information on how to obtain and dispute the report.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Disputes</h2>
              <p className="text-sm text-muted-foreground">To dispute inaccurate information, contact the screening vendor and our support team. We will cooperate with investigation.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Contact</h2>
              <p className="text-sm text-muted-foreground">For questions about screening, contact screening@ikonpropertygroup.com. Vendor contact information will be provided in notices.</p>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
