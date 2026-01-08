import React from "react";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <PublicLayout>
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">Contact Us</h1>
          <Card className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input id="company" placeholder="Company name" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} placeholder="How can we help?" />
              </div>
            </div>
            <Button className="w-full">Send Message</Button>
          </Card>
          <Card className="p-6">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@ikonpropertygroup.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Live Chat: Mon–Fri 9am–5pm EST</p>
            </div>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
