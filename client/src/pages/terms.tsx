import React from "react";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-4">Terms of Service</h1>
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Acceptance of Terms</h2>
              <p className="text-sm text-muted-foreground">By using IKON Property Management, you agree to these Terms of Service and represent that you have authority to bind your organization if applicable.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">User Accounts</h2>
              <p className="text-sm text-muted-foreground">You are responsible for safeguarding credentials, maintaining accurate information, and ensuring compliance with applicable laws including Fair Housing and FCRA.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Subscription and Billing</h2>
              <p className="text-sm text-muted-foreground">Paid plans are billed in advance. Fees are non-refundable except where required by law. Plan changes take effect at the next billing cycle.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Prohibited Uses</h2>
              <p className="text-sm text-muted-foreground">Do not misuse the service, attempt to access data without authorization, or use screening results for employment decisions.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Intellectual Property</h2>
              <p className="text-sm text-muted-foreground">IKON Property Group retains all rights to the platform, documentation, and branding. You may not copy or reverse engineer the software.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Limitation of Liability</h2>
              <p className="text-sm text-muted-foreground">To the fullest extent permitted by law, IKON is not liable for indirect or consequential damages. Total liability is limited to fees paid in the past 12 months.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Termination</h2>
              <p className="text-sm text-muted-foreground">We may suspend or terminate access for violations or nonpayment. You may terminate at any time by cancelling your subscription.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Governing Law</h2>
              <p className="text-sm text-muted-foreground">These terms are governed by the laws of the United States and the State of Florida.</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold">Contact</h2>
              <p className="text-sm text-muted-foreground">For questions, contact support@ikonpropertygroup.com.</p>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
