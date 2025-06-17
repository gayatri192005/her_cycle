import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CyclePrediction from '@/components/CyclePrediction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, LineChart, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { generateCycleInsights, PersonalInsights } from '@/utils/cycleInsights';
import { Skeleton } from '@/components/ui/skeleton';
import { useCycleInsights } from '@/contexts/CycleInsightsContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { insights, loading } = useCycleInsights();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            View your cycle information and upcoming predictions.
          </p>
        </div>
        
        <CyclePrediction />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card hercycle-shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Symptoms</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-hercycle-rose/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-3 flex-shrink-0">
                      <span className="text-lg">🤕</span>
                    </div>
                    <div>
                      <p className="font-medium">Headache</p>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <span className="text-sm bg-hercycle-rose px-2 py-0.5 rounded-full text-hercycle-deepPink">
                    Moderate
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-hercycle-rose/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-3 flex-shrink-0">
                      <span className="text-lg">💫</span>
                    </div>
                    <div>
                      <p className="font-medium">Cramps</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  <span className="text-sm bg-hercycle-rose px-2 py-0.5 rounded-full text-hercycle-deepPink">
                    Severe
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-hercycle-rose/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="mr-3 flex-shrink-0">
                      <span className="text-lg">😴</span>
                    </div>
                    <div>
                      <p className="font-medium">Fatigue</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  <span className="text-sm bg-hercycle-rose px-2 py-0.5 rounded-full text-hercycle-deepPink">
                    Mild
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card hercycle-shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Mood Patterns</h2>
              <div className="relative h-[220px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 text-center">
                    <p className="text-muted-foreground mb-2">More data needed</p>
                    <p className="text-sm text-muted-foreground">
                      Log your mood regularly to see patterns over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cycle Insights</CardTitle>
                <CardDescription>Your cycle patterns and predictions</CardDescription>
              </div>
              <LineChart className="text-muted-foreground h-5 w-5" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : !insights ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    Start tracking your cycle to see personalized insights.
                  </p>
                  <Button asChild size="sm" className="bg-hercycle-deepPink hover:bg-hercycle-deepPink/90">
                    <Link to="/log">Log Your Cycle</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {insights.predictions.nextPeriodStart && (
                      <div>
                        <span className="text-muted-foreground text-sm">Next period expected: </span>
                        <span className="font-medium">{insights.predictions.nextPeriodStart}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-muted-foreground text-sm">Average cycle length: </span>
                      <span className="font-medium">{insights.cycleAnalysis.averageCycleLength} days</span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground text-sm">Cycle regularity: </span>
                      <span className="font-medium capitalize">{insights.cycleAnalysis.cycleRegularity}</span>
                    </div>
                  </div>
                  
                  <Link to="/dashboard/insights" className="flex items-center justify-end text-sm font-medium text-hercycle-deepPink">
                    View all insights
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
