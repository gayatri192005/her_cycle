
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Droplet, Thermometer } from 'lucide-react';

const CyclePrediction = () => {
  // Mock data - would come from the Supabase database in a real app
  const cycleData = {
    currentDay: 18,
    cycleLength: 29,
    periodLength: 5,
    nextPeriod: 11,
    phase: "Luteal",
    averageCycle: 28,
    predictions: [
      { date: "May 12, 2023", type: "period", status: "actual" },
      { date: "June 9, 2023", type: "period", status: "actual" },
      { date: "July 7, 2023", type: "period", status: "actual" },
      { date: "August 4, 2023", type: "period", status: "predicted" },
    ]
  };

  const phaseInfo = {
    Follicular: {
      color: "bg-hercycle-softBlue",
      textColor: "text-blue-600",
      description: "Your body is preparing to release an egg."
    },
    Ovulation: {
      color: "bg-hercycle-softPurple",
      textColor: "text-purple-600",
      description: "Your body is releasing an egg."
    },
    Luteal: {
      color: "bg-hercycle-rose",
      textColor: "text-hercycle-deepPink",
      description: "Your body is preparing for a potential pregnancy."
    },
    Menstrual: {
      color: "bg-hercycle-pink",
      textColor: "text-pink-600",
      description: "Your period is happening."
    }
  };

  const currentPhase = phaseInfo[cycleData.phase as keyof typeof phaseInfo];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card hercycle-shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Cycle Overview</h2>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground/70">Cycle day</span>
                <span className="font-medium">{cycleData.currentDay} of {cycleData.cycleLength}</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
                <div 
                  className="bg-hercycle-deepPink h-2.5 rounded-full" 
                  style={{ width: `${(cycleData.currentDay / cycleData.cycleLength) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className={`${currentPhase.color} p-2 rounded-lg ${currentPhase.textColor} mr-3`}>
                  <Heart size={20} />
                </div>
                <div>
                  <h3 className="font-medium">{cycleData.phase} Phase</h3>
                  <p className="text-sm text-foreground/70">{currentPhase.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <div className="flex items-center mb-1">
                    <Calendar size={16} className="text-hercycle-deepPink mr-2" />
                    <span className="text-sm text-foreground/70">Next period in</span>
                  </div>
                  <p className="font-semibold text-lg">{cycleData.nextPeriod} days</p>
                </div>
                
                <div className="glass-card p-4">
                  <div className="flex items-center mb-1">
                    <Droplet size={16} className="text-hercycle-deepPink mr-2" />
                    <span className="text-sm text-foreground/70">Period duration</span>
                  </div>
                  <p className="font-semibold text-lg">{cycleData.periodLength} days</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium mb-4">Upcoming Predictions</h3>
              <div className="space-y-3">
                {cycleData.predictions.map((prediction, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${prediction.status === 'actual' ? 'bg-hercycle-deepPink' : 'bg-hercycle-pink/50'} mr-3`}></div>
                    <span className={`text-sm ${prediction.status === 'actual' ? 'text-foreground' : 'text-foreground/70'}`}>
                      {prediction.date}
                    </span>
                    {prediction.status === 'predicted' && (
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">Predicted</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hercycle-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Average Cycle</h3>
                <p className="text-2xl font-bold mt-2">{cycleData.averageCycle} days</p>
              </div>
              <div className="bg-hercycle-rose p-2 rounded-lg text-hercycle-deepPink">
                <Calendar size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hercycle-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Typical Period</h3>
                <p className="text-2xl font-bold mt-2">{cycleData.periodLength} days</p>
              </div>
              <div className="bg-hercycle-lavender p-2 rounded-lg text-purple-600">
                <Droplet size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hercycle-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Logged Cycles</h3>
                <p className="text-2xl font-bold mt-2">3</p>
              </div>
              <div className="bg-hercycle-softBlue p-2 rounded-lg text-blue-600">
                <Thermometer size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CyclePrediction;
