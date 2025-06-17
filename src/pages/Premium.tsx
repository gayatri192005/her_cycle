
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Star, Crown, Bell, Sparkles } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const Premium = () => {
  // Convert USD to INR (approximate conversion rate)
  const annualPriceUSD = 8.50;
  const exchangeRate = 83; // Approximate USD to INR exchange rate
  const annualPriceINR = Math.round(annualPriceUSD * exchangeRate);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HerCycle Premium</h1>
          <p className="text-muted-foreground">
            Unlock advanced features to better understand your cycle.
          </p>
        </div>
        
        <div className="glass-card hercycle-shadow p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-hercycle-deepPink/10 mb-4">
              <Crown className="text-hercycle-deepPink w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">Premium Features Coming Soon</h2>
            <p className="text-muted-foreground mt-2">
              We're working hard to bring you advanced cycle tracking and insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-hercycle-rose/20">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hercycle-rose/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-hercycle-deepPink" />
              </div>
              <div>
                <h3 className="font-medium">Advanced Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed pattern analysis and personalized recommendations based on your cycle data.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-hercycle-rose/20">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hercycle-rose/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-hercycle-deepPink" />
              </div>
              <div>
                <h3 className="font-medium">Smart Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Custom alerts for upcoming periods, ovulation, and medication reminders.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-hercycle-rose/20">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hercycle-rose/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-hercycle-deepPink" />
              </div>
              <div>
                <h3 className="font-medium">Health Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Downloadable reports to share with healthcare providers for better care.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-hercycle-rose/20">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hercycle-rose/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-hercycle-deepPink" />
              </div>
              <div>
                <h3 className="font-medium">Unlimited History</h3>
                <p className="text-sm text-muted-foreground">
                  Access your complete cycle history and tracking data without limitations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-hercycle-rose/10 p-6 rounded-lg text-center mb-8">
            <h3 className="text-xl font-semibold mb-2">Yearly Premium</h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl font-bold">${annualPriceUSD}</span>
              <span className="text-muted-foreground">/ year</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Approximately ₹{annualPriceINR} per year
            </p>
            <Button className="bg-hercycle-deepPink hover:bg-hercycle-deepPink/90 text-white w-full max-w-xs">
              Coming Soon
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Have questions? Contact our support team at <a href="mailto:support@hercycle.app" className="text-hercycle-deepPink hover:underline">support@hercycle.app</a>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Premium;
