import React from "react";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield, Zap, Globe } from "lucide-react";
import heroImage from "@assets/generated_images/modern_property_management_dashboard_abstract_concept.png";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-subtle-pattern opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium border border-primary/10">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Now available for Enterprise
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-tight tracking-tight text-primary">
                Property management <br />
                <span className="text-gradient">reimagined.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                The all-in-one platform for modern landlords and property managers. Streamline operations, delight tenants, and maximize revenue.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/landlord">
                  <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-full">
                    Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/tenant">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-2">
                    Tenant Login
                  </Button>
                </Link>
              </div>
              <div className="pt-8 border-t border-border flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative animate-in zoom-in-50 duration-1000 delay-200">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/20 glass-card p-2">
                <img 
                  src={heroImage} 
                  alt="Dashboard Preview" 
                  className="rounded-xl w-full h-auto object-cover"
                />
              </div>
              {/* Decorative blurs */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">Everything you need to run your portfolio</h2>
            <p className="text-muted-foreground text-lg">From tenant screening to maintenance requests, IKON handles the complex details so you can focus on growth.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Syndicated Listings</h3>
              <p className="text-muted-foreground">Push your vacancies to Zillow, Apartments.com, and more with a single click. Manage leads in one inbox.</p>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Automated Payments</h3>
              <p className="text-muted-foreground">Collect rent automatically. Support for ACH, Credit Cards, and split payments for roommates.</p>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tenant Screening</h3>
              <p className="text-muted-foreground">Built-in background checks, credit reports, and eviction history. Make informed decisions instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to upgrade your workflow?</h2>
          <p className="text-blue-200 text-xl mb-10 max-w-2xl mx-auto">Join thousands of landlords who trust IKON to manage their properties.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/landlord">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-base rounded-full font-bold">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}