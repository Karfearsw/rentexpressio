import React from "react";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4">Privacy Policy</h1>
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Information We Collect</h2>
              <p className="text-sm text-muted-foreground">We collect account data, payment data, usage data, and screening data with consent.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">How We Use Information</h2>
              <p className="text-sm text-muted-foreground">We use data to provide the service, process payments, run screening, and improve the platform.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Data Sharing</h2>
              <p className="text-sm text-muted-foreground">We share data with trusted vendors for payments, screening, and hosting. We do not sell personal data.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">We implement safeguards including encryption, role-based access, and audit logging where applicable.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Your Rights</h2>
              <p className="text-sm text-muted-foreground">You may request access or deletion of your data and opt out of marketing communications at any time.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Cookies</h2>
              <p className="text-sm text-muted-foreground">We use cookies to maintain sessions and improve features. You can control cookies in your browser.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Children's Privacy</h2>
              <p className="text-sm text-muted-foreground">The service is not directed to children under 13. We do not knowingly collect data from minors.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Changes</h2>
              <p className="text-sm text-muted-foreground">We may update this policy and will post the effective date on this page.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Contact</h2>
              <p className="text-sm text-muted-foreground">For privacy requests, contact privacy@ikonpropertygroup.com.</p>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
