import React from "react";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ListingIcon, AutoPayIcon, ScreeningIcon } from "@/components/ui/custom-icons";
import heroImage from "@assets/generated_images/modern_property_management_dashboard_abstract_concept.png";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:pb-32 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-subtle-pattern opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-10 duration-700">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/5 text-primary text-xs sm:text-sm font-medium border border-primary/10">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Now available for Enterprise
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight tracking-tight text-primary">
                Property management <br className="hidden sm:block" />
                <span className="text-gradient">reimagined.</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                The all-in-one platform for modern landlords and property managers. Streamline operations, delight tenants, and maximize revenue.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto h-11 sm:h-14 px-6 sm:px-8 text-sm sm:text-base shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-full" aria-label="Create account">
                    Create Account <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 sm:h-14 px-6 sm:px-8 text-sm sm:text-base rounded-full border-2">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative animate-in zoom-in-50 duration-1000 delay-200">
              <div className="relative z-10 rounded-lg sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border border-white/20 glass-card p-2 sm:p-4">
                <img 
                  src={heroImage} 
                  alt="Dashboard Preview" 
                  className="rounded-lg sm:rounded-xl w-full h-auto object-cover"
                />
              </div>
              {/* Decorative blurs - hidden on mobile */}
              <div className="hidden sm:block absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
              <div className="hidden sm:block absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-4">Everything you need to run your portfolio</h2>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">From tenant screening to maintenance requests, IKON handles the complex details so you can focus on growth.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-lg sm:rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-16 h-16 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <ListingIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Syndicated Listings</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Push your vacancies to Zillow, Apartments.com, and more with a single click. Manage leads in one inbox.</p>
            </div>
            <div className="p-6 sm:p-8 rounded-lg sm:rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-16 h-16 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <AutoPayIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Automated Payments</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Collect rent automatically. Support for ACH, Credit Cards, and split payments for roommates.</p>
            </div>
            <div className="p-6 sm:p-8 rounded-lg sm:rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <ScreeningIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Tenant Screening</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Built-in background checks, credit reports, and eviction history. Make informed decisions instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden flex items-center justify-center min-h-[400px]">
        {/* Background Image with lower opacity */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        
        {/* Stronger Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-primary/90 to-primary/80"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center justify-center h-full">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in zoom-in-50 duration-700">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight leading-tight text-white drop-shadow-lg">
              Ready to upgrade your workflow?
            </h2>
            <p className="text-blue-50 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
              Join thousands who trust RentExpress to streamline their property rental processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 sm:h-14 px-8 text-base font-bold rounded-full shadow-lg shadow-black/20 hover:shadow-xl transition-all hover:scale-105" aria-label="Get started">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 text-base rounded-full border-white/20 text-white hover:bg-white/10 hover:text-white transition-all hover:scale-105">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
