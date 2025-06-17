import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentCycleStatus, CurrentCycleStatus } from '@/utils/cycleInsights';
import CyclePhaseIndicator from '@/components/CyclePhaseIndicator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCycleInsights } from '@/contexts/CycleInsightsContext';

// Mock data for period tracking
const mockPeriodsData = [
  { date: new Date(2024, 4, 3), type: 'period', intensity: 'heavy' },
  { date: new Date(2024, 4, 4), type: 'period', intensity: 'heavy' },
  { date: new Date(2024, 4, 5), type: 'period', intensity: 'medium' },
  { date: new Date(2024, 4, 6), type: 'period', intensity: 'light' },
  { date: new Date(2024, 4, 7), type: 'period', intensity: 'light' },
  { date: new Date(2024, 3, 5), type: 'period', intensity: 'heavy' },
  { date: new Date(2024, 3, 6), type: 'period', intensity: 'heavy' },
  { date: new Date(2024, 3, 7), type: 'period', intensity: 'medium' },
  { date: new Date(2024, 3, 8), type: 'period', intensity: 'light' },
  { date: new Date(2024, 3, 9), type: 'period', intensity: 'light' },
  { date: new Date(2024, 4, 16), type: 'ovulation' },
];

// Mock symptoms data
const mockSymptomsData = [
  { date: new Date(2024, 4, 3), symptoms: ['cramps', 'headache', 'fatigue'] },
  { date: new Date(2024, 4, 4), symptoms: ['cramps', 'bloating'] },
  { date: new Date(2024, 4, 5), symptoms: ['fatigue'] },
  { date: new Date(2024, 3, 5), symptoms: ['cramps', 'headache'] },
  { date: new Date(2024, 3, 6), symptoms: ['cramps', 'bloating', 'mood swings'] },
];

const DashboardCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateData, setSelectedDateData] = useState<any>(null);
  const { user } = useAuth();
  const { cycleStatus, loading } = useCycleInsights();

  const getDateStyle = (day: Date) => {
    const periodData = mockPeriodsData.find(
      (p) => p.date.getDate() === day.getDate() && 
             p.date.getMonth() === day.getMonth() && 
             p.date.getFullYear() === day.getFullYear()
    );

    if (periodData) {
      if (periodData.type === 'period') {
        switch (periodData.intensity) {
          case 'heavy':
            return 'bg-hercycle-deepPink text-white hover:bg-hercycle-deepPink hover:text-white';
          case 'medium':
            return 'bg-hercycle-rose text-white hover:bg-hercycle-rose hover:text-white';
          case 'light':
            return 'bg-hercycle-rose/60 text-white hover:bg-hercycle-rose/60 hover:text-white';
          default:
            return '';
        }
      } else if (periodData.type === 'ovulation') {
        return 'bg-blue-400 text-white hover:bg-blue-400 hover:text-white';
      }
    }
    return '';
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    if (selectedDate) {
      // Find period data for the selected date
      const periodData = mockPeriodsData.find(
        (p) => p.date.getDate() === selectedDate.getDate() && 
               p.date.getMonth() === selectedDate.getMonth() && 
               p.date.getFullYear() === selectedDate.getFullYear()
      );
      
      // Find symptoms data for the selected date
      const symptomsData = mockSymptomsData.find(
        (s) => s.date.getDate() === selectedDate.getDate() && 
               s.date.getMonth() === selectedDate.getMonth() && 
               s.date.getFullYear() === selectedDate.getFullYear()
      );
      
      setSelectedDateData({
        period: periodData,
        symptoms: symptomsData ? symptomsData.symptoms : [],
        date: selectedDate
      });
    } else {
      setSelectedDateData(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Track your cycle and symptoms over time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="glass-card hercycle-shadow p-4 md:col-span-8">
            <div className="w-full flex justify-center">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
                modifiersClassNames={{
                  selected: 'bg-primary text-primary-foreground'
                }}
                modifiers={{
                  customModifier: (date) => !!mockPeriodsData.find(
                    (p) => p.date.getDate() === date.getDate() && 
                           p.date.getMonth() === date.getMonth() && 
                           p.date.getFullYear() === date.getFullYear()
                  )
                }}
                components={{
                  Day: ({ date: dayDate, ...props }) => {
                    const customStyle = getDateStyle(dayDate);
                    const isInCurrentMonth = dayDate.getMonth() === date?.getMonth();
                    return (
                      <button
                        {...props}
                        className={`${props.className} ${customStyle}`}
                      >
                        {cycleStatus && dayDate && isInCurrentMonth && (
                          <div className="absolute top-1 right-1">
                            {(() => {
                              if (!cycleStatus.cycleStartDate) return null;
                              
                              const cycleStartDate = new Date(cycleStatus.cycleStartDate);
                              const diffTime = Math.abs(dayDate.getTime() - cycleStartDate.getTime());
                              const dayOfCycle = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                              
                              if (dayOfCycle > 0 && dayOfCycle <= (cycleStatus.dayOfCycle || 0) + 10) {
                                const dayStr = dayDate.toISOString().split('T')[0];
                                const isFertileDay = 
                                  cycleStatus.fertileWindow.start && 
                                  cycleStatus.fertileWindow.end && 
                                  dayStr >= cycleStatus.fertileWindow.start && 
                                  dayStr <= cycleStatus.fertileWindow.end;
                                
                                return (
                                  <CyclePhaseIndicator 
                                    dayOfCycle={dayOfCycle} 
                                    averageCycleLength={28} 
                                    isFertileDay={isFertileDay}
                                  />
                                );
                              }
                              
                              return null;
                            })()}
                          </div>
                        )}
                      </button>
                    );
                  }
                }}
              />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-hercycle-deepPink"></div>
                <span className="text-sm">Heavy flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-hercycle-rose"></div>
                <span className="text-sm">Medium flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-hercycle-rose/60"></div>
                <span className="text-sm">Light flow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                <span className="text-sm">Ovulation</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-4 space-y-6">
            {selectedDateData ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>
                    {format(selectedDateData.date, 'MMMM d, yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateData.period ? 
                      `${selectedDateData.period.type === 'period' ? 'Period day' : 'Ovulation day'}` : 
                      'No period data recorded'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateData.period && selectedDateData.period.type === 'period' && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Flow intensity:</p>
                      <Badge 
                        className={`${
                          selectedDateData.period.intensity === 'heavy' ? 'bg-hercycle-deepPink' :
                          selectedDateData.period.intensity === 'medium' ? 'bg-hercycle-rose' :
                          'bg-hercycle-rose/60'
                        }`}
                      >
                        {selectedDateData.period.intensity.charAt(0).toUpperCase() + selectedDateData.period.intensity.slice(1)}
                      </Badge>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Symptoms:</p>
                    {selectedDateData.symptoms.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedDateData.symptoms.map((symptom: string, index: number) => (
                          <Badge key={index} variant="outline" className="capitalize">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No symptoms recorded</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Daily Details</CardTitle>
                  <CardDescription>
                    Select a date to view details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-6">
                    Click on a date to view recorded information
                  </p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>
                  Your predicted cycle events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-hercycle-deepPink"></div>
                    <span>Next period</span>
                  </div>
                  <span className="font-semibold">June 1, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span>Next ovulation</span>
                  </div>
                  <span className="font-semibold">May 16, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span>Fertile window starts</span>
                  </div>
                  <span className="font-semibold">May 13, 2024</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-medium mb-3">Calendar Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-hercycle-deepPink mr-2"></div>
            <span className="text-sm">Menstrual Phase</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-hercycle-pink/60 mr-2"></div>
            <span className="text-sm">Follicular Phase</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
            <span className="text-sm">Ovulatory Phase</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-400 mr-2"></div>
            <span className="text-sm">Luteal Phase</span>
          </div>
          <div className="flex items-center">
            <div className="relative mr-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-sm">Potentially Fertile Day</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardCalendar;
