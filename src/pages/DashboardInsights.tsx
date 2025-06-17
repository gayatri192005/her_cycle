import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { generateCycleInsights, PersonalInsights, getCyclePhaseDescription, getSymptomManagementTips } from '@/utils/cycleInsights';
import { useToast } from '@/hooks/use-toast';
import { useCycleInsights } from '@/contexts/CycleInsightsContext';

// Colors for charts
const COLORS = ['#FF8042', '#c084fc', '#FF5C8D', '#82ca9d', '#8884d8'];

const DashboardInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { insights, loading, cycleStatus } = useCycleInsights();
  const currentPhase = cycleStatus ? {
    phase: cycleStatus.currentPhase,
    description: cycleStatus.phaseDescription,
    tips: cycleStatus.phaseTips
  } : null;

  // Format cycle length data for charts
  const getCycleLengthData = () => {
    if (!insights || !insights.cycleAnalysis.totalTrackedCycles) {
      return [];
    }

    // This would typically come from actual cycle records
    // For demo, generating based on average length and variation
    const avgLength = insights.cycleAnalysis.averageCycleLength;
    const variation = insights.cycleAnalysis.cycleVariation;
    
    // Generate last 5 months of data based on averages and variation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return months.map((month, i) => ({
      month,
      length: Math.max(21, Math.min(35, avgLength + (Math.random() * variation * 2 - variation)))
    }));
  };

  // Format period length data for charts
  const getPeriodLengthData = () => {
    if (!insights || !insights.cycleAnalysis.totalTrackedCycles) {
      return [];
    }

    // Generate based on average period length
    const avgLength = insights.cycleAnalysis.averagePeriodLength;
    
    // Generate last 5 months of data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return months.map((month) => ({
      month,
      length: Math.max(2, Math.min(8, avgLength + (Math.random() * 2 - 1)))
    }));
  };

  // Format symptom frequency data for charts
  const getSymptomFrequencyData = () => {
    if (!insights || !insights.commonSymptoms.length) {
      return [];
    }

    return insights.commonSymptoms.map(symptom => ({
      name: symptom.symptom,
      value: symptom.frequency
    }));
  };

  // Format mood data for charts
  const getMoodFrequencyData = () => {
    if (!insights || !insights.moodPatterns.length) {
      return [];
    }

    return insights.moodPatterns.slice(0, 5).map(mood => ({
      name: mood.mood,
      value: mood.frequency
    }));
  };

  // Get symptom management tips
  const getSymptomTips = () => {
    if (!insights || !insights.commonSymptoms.length) {
      return {};
    }

    return getSymptomManagementTips(insights.commonSymptoms);
  };

  const renderCyclePhaseInfo = () => {
    if (!currentPhase) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Cycle Phase</CardTitle>
          <CardDescription>Based on your tracked data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-xl font-semibold text-hercycle-deepPink">{currentPhase.phase}</h3>
          <p>{currentPhase.description}</p>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Tips for this phase:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {currentPhase.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPersonalizedTips = () => {
    if (!insights || !insights.personalizedTips.length) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Insights</CardTitle>
          <CardDescription>Based on your cycle patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {insights.personalizedTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-hercycle-deepPink mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  const renderCyclePredictions = () => {
    if (!insights || !insights.predictions.nextPeriodStart) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Cycle Predictions</CardTitle>
          <CardDescription>
            Based on your historical data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Next period expected</h3>
            <p className="text-xl font-semibold">{insights.predictions.nextPeriodStart}</p>
            <p className="text-sm text-muted-foreground">
              Confidence: <span className="font-medium">{insights.predictions.confidenceLevel.charAt(0).toUpperCase() + insights.predictions.confidenceLevel.slice(1)}</span>
            </p>
          </div>
          
          {insights.predictions.nextFertileWindow.start && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fertile window</h3>
              <p className="text-xl font-semibold">
                {insights.predictions.nextFertileWindow.start} to {insights.predictions.nextFertileWindow.end}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderInsightsSummary = () => {
    if (!insights) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Cycle</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{insights.cycleAnalysis.averageCycleLength} days</div>
            <p className="text-xs text-muted-foreground">From {insights.cycleAnalysis.totalTrackedCycles} tracked cycles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Period Duration</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{insights.cycleAnalysis.averagePeriodLength} days</div>
            <p className="text-xs text-muted-foreground">Average duration</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cycle Regularity</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold capitalize">{insights.cycleAnalysis.cycleRegularity}</div>
            <p className="text-xs text-muted-foreground">Variation: ±{insights.cycleAnalysis.cycleVariation} days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Period</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{insights.predictions.nextPeriodStart || 'Unknown'}</div>
            <p className="text-xs text-muted-foreground capitalize">Confidence: {insights.predictions.confidenceLevel}</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">
            Analyze your cycle patterns and symptoms over time.
          </p>
        </div>

        {loading ? (
          // Loading state
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-8 w-20 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : !insights ? (
          // No data state
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Not Enough Data</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start tracking your cycle to see personalized insights. Log at least one complete cycle for basic analysis.
            </p>
            <Button asChild className="bg-hercycle-deepPink hover:bg-hercycle-deepPink/90">
              <Link to="/log">Log Your Cycle</Link>
            </Button>
          </Card>
        ) : (
          // Data available
          <>
            {renderInsightsSummary()}
            
            <Tabs defaultValue="cycle" className="space-y-4">
              <TabsList>
                <TabsTrigger value="cycle">Cycle Analysis</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="current">Current Phase</TabsTrigger>
              </TabsList>

              <TabsContent value="cycle" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cycle Length</CardTitle>
                      <CardDescription>Your cycle length over the past 5 months</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getCycleLengthData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[20, 35]} />
                          <RechartsTooltip />
                          <Line type="monotone" dataKey="length" stroke="#FF5C8D" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Period Duration</CardTitle>
                      <CardDescription>Your period duration over the past 5 months</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getPeriodLengthData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 8]} />
                          <RechartsTooltip />
                          <Bar dataKey="length" fill="#FF5C8D" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                
                {renderCyclePredictions()}
                
                {!insights.predictions.nextPeriodStart && (
                  <Card className="relative">
                    <div className="absolute top-0 right-0 w-full h-full bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                      <div className="bg-hercycle-deepPink/10 p-3 rounded-full">
                        <Crown className="h-10 w-10 text-hercycle-deepPink" />
                      </div>
                      <h3 className="text-xl font-semibold">Premium Feature</h3>
                      <p className="text-center max-w-md text-muted-foreground">
                        Upgrade to HerCycle Premium to unlock advanced cycle insights and predictions.
                      </p>
                      <Button asChild className="mt-4 bg-hercycle-deepPink hover:bg-hercycle-deepPink/90">
                        <Link to="/premium">View Premium Options</Link>
                      </Button>
                    </div>
                    <CardHeader>
                      <CardTitle>Cycle Predictions</CardTitle>
                      <CardDescription>
                        Advanced predictions based on your historical data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center">
                      <p className="text-muted-foreground">Chart preview</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="symptoms" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Symptoms Frequency</CardTitle>
                      <CardDescription>Most common symptoms during your cycle</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getSymptomFrequencyData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {getSymptomFrequencyData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Symptom Management</CardTitle>
                      <CardDescription>
                        Tips for managing your common symptoms
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] overflow-auto">
                      {Object.entries(getSymptomTips()).map(([symptom, tips]) => (
                        <div key={symptom} className="mb-4">
                          <h3 className="font-semibold capitalize mb-2">{symptom}</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {tips.map((tip, i) => (
                              <li key={i} className="text-sm">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="relative">
                  <div className="absolute top-0 right-0 w-full h-full bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                    <div className="bg-hercycle-deepPink/10 p-3 rounded-full">
                      <Crown className="h-10 w-10 text-hercycle-deepPink" />
                    </div>
                    <h3 className="text-xl font-semibold">Premium Feature</h3>
                    <p className="text-center max-w-md text-muted-foreground">
                      Upgrade to HerCycle Premium to unlock advanced symptom patterns and correlations.
                    </p>
                    <Button asChild className="mt-4 bg-hercycle-deepPink hover:bg-hercycle-deepPink/90">
                      <Link to="/premium">View Premium Options</Link>
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle>Symptom Timeline</CardTitle>
                    <CardDescription>
                      How your symptoms correlate with cycle phases
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-muted-foreground">Chart preview</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="current" className="space-y-4">
                {renderCyclePhaseInfo()}
                {renderPersonalizedTips()}
                
                <Card className="relative">
                  <div className="absolute top-0 right-0 w-full h-full bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                    <div className="bg-hercycle-deepPink/10 p-3 rounded-full">
                      <Crown className="h-10 w-10 text-hercycle-deepPink" />
                    </div>
                    <h3 className="text-xl font-semibold">Premium Feature</h3>
                    <p className="text-center max-w-md text-muted-foreground">
                      Upgrade to HerCycle Premium to access detailed trends analysis and personalized insights.
                    </p>
                    <Button asChild className="mt-4 bg-hercycle-deepPink hover:bg-hercycle-deepPink/90">
                      <Link to="/premium">View Premium Options</Link>
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle>Lifestyle Recommendations</CardTitle>
                    <CardDescription>
                      Personalized suggestions for your current cycle phase
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-muted-foreground">Advanced recommendations available with premium</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardInsights;
