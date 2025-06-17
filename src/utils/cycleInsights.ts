import { supabase } from '@/integrations/supabase/client';

// Types for cycle analysis results
export interface CycleAnalysis {
  averageCycleLength: number;
  averagePeriodLength: number;
  cycleRegularity: 'regular' | 'irregular' | 'unknown';
  cycleVariation: number;
  totalTrackedCycles: number;
  shortestCycle: number;
  longestCycle: number;
}

export interface SymptomPattern {
  symptom: string;
  frequency: number; // percentage of cycles with this symptom
  phaseFrequency: {
    menstrual: number;
    follicular: number;
    ovulatory: number;
    luteal: number;
  };
}

export interface MoodPattern {
  mood: string;
  frequency: number;
  phaseFrequency: {
    menstrual: number;
    follicular: number;
    ovulatory: number;
    luteal: number;
  };
}

export interface PersonalInsights {
  cycleAnalysis: CycleAnalysis;
  commonSymptoms: SymptomPattern[];
  moodPatterns: MoodPattern[];
  predictions: {
    nextPeriodStart: string | null;
    confidenceLevel: 'high' | 'medium' | 'low' | 'unknown';
    nextFertileWindow: {
      start: string | null;
      end: string | null;
    };
  };
  personalizedTips: string[];
}

// Interface for current cycle status
export interface CurrentCycleStatus {
  isActive: boolean;
  dayOfCycle: number | null;
  currentPhase: string;
  phaseDescription: string;
  phaseTips: string[];
  isFertile: boolean;
  cycleStartDate: string | null;
  nextPeriodDate: string | null;
  periodWindow: { start: string | null; end: string | null };
  fertileWindow: { start: string | null; end: string | null };
}

// Helper function to calculate the average of an array of numbers
const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

// Helper function to calculate standard deviation
const calculateStandardDeviation = (numbers: number[], average: number): number => {
  if (numbers.length < 2) return 0;
  const squareDiffs = numbers.map(value => Math.pow(value - average, 2));
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

// Function to determine cycle phase based on day of cycle
const determineCyclePhase = (dayOfCycle: number, averageCycleLength: number): 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' => {
  // Default assumptions if no specific data available
  const menstrualPhaseDuration = 5; // days 1-5
  const ovulationDay = Math.floor(averageCycleLength / 2) - 2; // ~day 12-14 in a 28-day cycle
  
  if (dayOfCycle <= menstrualPhaseDuration) {
    return 'menstrual';
  } else if (dayOfCycle < ovulationDay - 1) {
    return 'follicular';
  } else if (dayOfCycle >= ovulationDay - 1 && dayOfCycle <= ovulationDay + 1) {
    return 'ovulatory';
  } else {
    return 'luteal';
  }
};

// Function to analyze cycle data and generate personalized insights
export const generateCycleInsights = async (userId: string): Promise<PersonalInsights | null> => {
  try {
    // Fetch all completed cycles for the user
    const { data: cycles, error: cyclesError } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .not('end_date', 'is', null)
      .order('start_date', { ascending: false });

    if (cyclesError || !cycles || cycles.length === 0) {
      console.error('Error fetching cycles or no cycles found:', cyclesError);
      return null;
    }

    // Calculate cycle lengths
    const cycleLengths: number[] = [];
    const periodLengths: number[] = [];
    
    for (const cycle of cycles) {
      if (cycle.start_date && cycle.end_date) {
        const cycleStart = new Date(cycle.start_date);
        const cycleEnd = new Date(cycle.end_date);
        const nextCycleStart = cycles.find(c => 
          new Date(c.start_date) > cycleEnd
        )?.start_date;
        
        if (nextCycleStart) {
          const nextCycleStartDate = new Date(nextCycleStart);
          const cycleLength = Math.round((nextCycleStartDate.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
          if (cycleLength > 0 && cycleLength < 60) { // Filter out unrealistic values
            cycleLengths.push(cycleLength);
          }
        }
        
        // Calculate period length
        const periodLength = Math.round((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (periodLength > 0 && periodLength < 15) { // Filter out unrealistic values
          periodLengths.push(periodLength);
        }
      }
    }

    // Get all period logs for analysis
    const { data: logs, error: logsError } = await supabase
      .from('period_logs')
      .select('*')
      .eq('user_id', userId)
      .order('log_date', { ascending: true });

    if (logsError) {
      console.error('Error fetching period logs:', logsError);
      return null;
    }

    // Calculate cycle statistics
    const averageCycleLength = calculateAverage(cycleLengths);
    const cycleVariation = calculateStandardDeviation(cycleLengths, averageCycleLength);
    const averagePeriodLength = calculateAverage(periodLengths);
    
    // Determine cycle regularity
    let cycleRegularity: 'regular' | 'irregular' | 'unknown' = 'unknown';
    if (cycleLengths.length >= 3) {
      cycleRegularity = cycleVariation <= 3 ? 'regular' : 'irregular';
    }

    // Analyze symptoms
    const symptomsMap = new Map<string, {
      count: number,
      phases: {
        menstrual: number,
        follicular: number,
        ovulatory: number,
        luteal: number
      }
    }>();
    
    // Analyze moods
    const moodsMap = new Map<string, {
      count: number,
      phases: {
        menstrual: number,
        follicular: number,
        ovulatory: number,
        luteal: number
      }
    }>();

    // Process logs to gather symptom and mood data
    if (logs && logs.length > 0) {
      for (const log of logs) {
        // Find which cycle this log belongs to
        const cycleStart = cycles.find(c => 
          new Date(c.start_date) <= new Date(log.log_date) && 
          (!c.end_date || new Date(c.end_date) >= new Date(log.log_date))
        );

        if (cycleStart) {
          const logDate = new Date(log.log_date);
          const cycleStartDate = new Date(cycleStart.start_date);
          const dayOfCycle = Math.floor((logDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const phase = determineCyclePhase(dayOfCycle, averageCycleLength);

          // Process symptoms
          if (log.symptoms && log.symptoms.length > 0) {
            log.symptoms.forEach(symptom => {
              if (!symptomsMap.has(symptom)) {
                symptomsMap.set(symptom, {
                  count: 0,
                  phases: { menstrual: 0, follicular: 0, ovulatory: 0, luteal: 0 }
                });
              }
              
              const symptomData = symptomsMap.get(symptom)!;
              symptomData.count++;
              symptomData.phases[phase]++;
            });
          }

          // Process mood
          if (log.mood) {
            if (!moodsMap.has(log.mood)) {
              moodsMap.set(log.mood, {
                count: 0,
                phases: { menstrual: 0, follicular: 0, ovulatory: 0, luteal: 0 }
              });
            }
            
            const moodData = moodsMap.get(log.mood)!;
            moodData.count++;
            moodData.phases[phase]++;
          }
        }
      }
    }

    // Convert symptoms map to array and calculate percentages
    const totalLogs = logs?.length || 0;
    const commonSymptoms: SymptomPattern[] = Array.from(symptomsMap.entries())
      .map(([symptom, data]) => ({
        symptom,
        frequency: Math.round((data.count / totalLogs) * 100),
        phaseFrequency: {
          menstrual: Math.round((data.phases.menstrual / (data.count || 1)) * 100),
          follicular: Math.round((data.phases.follicular / (data.count || 1)) * 100),
          ovulatory: Math.round((data.phases.ovulatory / (data.count || 1)) * 100),
          luteal: Math.round((data.phases.luteal / (data.count || 1)) * 100)
        }
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5); // Top 5 symptoms

    // Convert moods map to array and calculate percentages
    const moodPatterns: MoodPattern[] = Array.from(moodsMap.entries())
      .map(([mood, data]) => ({
        mood,
        frequency: Math.round((data.count / totalLogs) * 100),
        phaseFrequency: {
          menstrual: Math.round((data.phases.menstrual / (data.count || 1)) * 100),
          follicular: Math.round((data.phases.follicular / (data.count || 1)) * 100),
          ovulatory: Math.round((data.phases.ovulatory / (data.count || 1)) * 100),
          luteal: Math.round((data.phases.luteal / (data.count || 1)) * 100)
        }
      }))
      .sort((a, b) => b.frequency - a.frequency);

    // Predict next period start
    let nextPeriodStart: string | null = null;
    let confidenceLevel: 'high' | 'medium' | 'low' | 'unknown' = 'unknown';
    let nextFertileWindow = { start: null, end: null };

    if (cycles.length > 0 && averageCycleLength > 0) {
      const lastCycleStart = new Date(cycles[0].start_date);
      const predictedNextStart = new Date(lastCycleStart);
      predictedNextStart.setDate(lastCycleStart.getDate() + Math.round(averageCycleLength));
      
      nextPeriodStart = predictedNextStart.toISOString().split('T')[0];
      
      // Set confidence level based on cycle regularity
      if (cycleRegularity === 'regular' && cycles.length >= 3) {
        confidenceLevel = 'high';
      } else if (cycles.length >= 2) {
        confidenceLevel = 'medium';
      } else {
        confidenceLevel = 'low';
      }
      
      // Calculate fertile window (typically 5 days before ovulation plus ovulation day)
      const ovulationDay = new Date(lastCycleStart);
      ovulationDay.setDate(lastCycleStart.getDate() + Math.round(averageCycleLength / 2) - 2);
      
      const fertileStart = new Date(ovulationDay);
      fertileStart.setDate(ovulationDay.getDate() - 5);
      
      const fertileEnd = new Date(ovulationDay);
      fertileEnd.setDate(ovulationDay.getDate() + 1);
      
      nextFertileWindow = {
        start: fertileStart.toISOString().split('T')[0],
        end: fertileEnd.toISOString().split('T')[0]
      };
    }

    // Generate personalized tips based on analysis
    const personalizedTips: string[] = [];
    
    if (cycleRegularity === 'irregular' && cycleVariation > 5) {
      personalizedTips.push('Your cycle shows significant variation. Consider tracking additional factors like stress, sleep, and exercise to identify potential triggers.');
    }
    
    if (commonSymptoms.some(s => s.symptom === 'cramps' && s.frequency > 50)) {
      personalizedTips.push('Cramps appear regularly in your cycles. Heat therapy and gentle exercise may help reduce discomfort.');
    }
    
    if (moodPatterns.some(m => m.mood === 'irritable' && m.phaseFrequency.luteal > 40)) {
      personalizedTips.push('Your mood tends to change before your period. Consider mindfulness practices during this phase.');
    }
    
    if (averageCycleLength < 21 || averageCycleLength > 35) {
      personalizedTips.push('Your average cycle length is outside the typical range. Consider discussing this with a healthcare provider.');
    }
    
    // If not enough data, add a general tip
    if (cycles.length < 3) {
      personalizedTips.push('Continue tracking your cycle for more personalized insights. More data leads to better predictions!');
    }

    return {
      cycleAnalysis: {
        averageCycleLength: Math.round(averageCycleLength),
        averagePeriodLength: Math.round(averagePeriodLength),
        cycleRegularity,
        cycleVariation: Math.round(cycleVariation * 10) / 10,
        totalTrackedCycles: cycles.length,
        shortestCycle: Math.min(...cycleLengths) || 0,
        longestCycle: Math.max(...cycleLengths) || 0
      },
      commonSymptoms,
      moodPatterns,
      predictions: {
        nextPeriodStart,
        confidenceLevel,
        nextFertileWindow
      },
      personalizedTips: personalizedTips.length > 0 ? personalizedTips : ['Keep tracking your cycle consistently for personalized insights!']
    };
  } catch (error) {
    console.error('Error generating cycle insights:', error);
    return null;
  }
};

// Function to get cycle phase description based on current cycle day
export const getCyclePhaseDescription = (dayOfCycle: number, averageCycleLength: number): {
  phase: string;
  description: string;
  tips: string[];
} => {
  const phase = determineCyclePhase(dayOfCycle, averageCycleLength);
  
  switch (phase) {
    case 'menstrual':
      return {
        phase: 'Menstrual Phase',
        description: 'Your body is shedding the uterine lining. Energy levels may be lower during this time.',
        tips: [
          'Focus on rest and self-care',
          'Stay hydrated and warm',
          'Gentle exercise like yoga may help with cramps'
        ]
      };
    case 'follicular':
      return {
        phase: 'Follicular Phase',
        description: 'Estrogen is rising as your body prepares for ovulation. You may notice increased energy and creativity.',
        tips: [
          'Great time for starting new projects',
          'Your energy is building - ideal for more intense workouts',
          'Socialize and connect with others'
        ]
      };
    case 'ovulatory':
      return {
        phase: 'Ovulatory Phase',
        description: 'Your body is releasing an egg. You may feel most energetic and confident during this phase.',
        tips: [
          'Peak fertility window if trying to conceive',
          'Ideal time for high-intensity exercise',
          'You may feel more social and outgoing'
        ]
      };
    case 'luteal':
      return {
        phase: 'Luteal Phase',
        description: 'Progesterone rises and then falls if no pregnancy occurs. You may notice mood changes and physical symptoms.',
        tips: [
          'Focus on completing existing projects',
          'Pay attention to self-care as energy decreases',
          'Consider reducing caffeine and sugar which may worsen PMS'
        ]
      };
    default:
      return {
        phase: 'Unknown',
        description: 'Not enough data to determine your current cycle phase.',
        tips: ['Continue tracking your cycle for more personalized insights']
      };
  }
};

// Function to get top symptom management tips based on user data
export const getSymptomManagementTips = (symptoms: SymptomPattern[]): Record<string, string[]> => {
  const tips: Record<string, string[]> = {};
  
  symptoms.forEach(symptom => {
    switch (symptom.symptom.toLowerCase()) {
      case 'cramps':
        tips['cramps'] = [
          'Apply heat to your lower abdomen',
          'Try gentle stretching or yoga',
          'Stay hydrated and consider anti-inflammatory foods',
          'Over-the-counter pain relievers like ibuprofen can help'
        ];
        break;
      case 'headache':
        tips['headache'] = [
          'Ensure adequate hydration',
          'Try relaxation techniques like deep breathing',
          'Apply a cold compress to your forehead',
          'Reduce screen time and rest in a dark room'
        ];
        break;
      case 'bloating':
        tips['bloating'] = [
          'Limit salt intake during this time',
          'Stay hydrated with water',
          'Gentle exercise can help reduce water retention',
          'Consider foods rich in potassium like bananas and leafy greens'
        ];
        break;
      case 'fatigue':
        tips['fatigue'] = [
          'Prioritize getting enough sleep',
          'Consider iron-rich foods if your fatigue coincides with your period',
          'Light exercise can boost energy',
          'Balance activity with rest periods'
        ];
        break;
      case 'mood swings':
      case 'irritable':
      case 'emotional':
        tips['mood'] = [
          'Practice mindfulness meditation',
          'Regular exercise can help stabilize mood',
          'Prioritize sleep and stress management',
          'Track mood triggers to better prepare for future cycles'
        ];
        break;
      default:
        if (!tips['general']) {
          tips['general'] = [
            'Track your symptoms consistently to identify patterns',
            'Consider discussing persistent symptoms with a healthcare provider',
            'Lifestyle factors like sleep, diet, and stress can impact cycle symptoms'
          ];
        }
    }
  });
  
  return tips;
};

// Function to get the current cycle status for a user
export const getCurrentCycleStatus = async (userId: string): Promise<CurrentCycleStatus | null> => {
  try {
    // Get insights to calculate predictions
    const insights = await generateCycleInsights(userId);
    if (!insights) return null;
    
    const averageCycleLength = insights.cycleAnalysis.averageCycleLength || 28;
    
    // Get the most recent cycle
    const { data: latestCycle, error: cycleError } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
      .limit(1)
      .single();
      
    if (cycleError || !latestCycle) {
      return null;
    }
    
    const today = new Date();
    const cycleStartDate = new Date(latestCycle.start_date);
    
    // Calculate day of cycle
    const diffTime = Math.abs(today.getTime() - cycleStartDate.getTime());
    const dayOfCycle = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Get phase information
    const phaseInfo = getCyclePhaseDescription(dayOfCycle, averageCycleLength);
    
    // Determine if it's a potentially fertile day (ovulatory phase or 5 days before)
    const ovulationDay = Math.floor(averageCycleLength / 2) - 2;
    const isFertile = dayOfCycle >= (ovulationDay - 5) && dayOfCycle <= (ovulationDay + 1);
    
    // Calculate next period date
    const nextPeriodDate = new Date(cycleStartDate);
    nextPeriodDate.setDate(cycleStartDate.getDate() + averageCycleLength);
    
    // Calculate period window
    const periodEnd = new Date(cycleStartDate);
    periodEnd.setDate(cycleStartDate.getDate() + (insights.cycleAnalysis.averagePeriodLength - 1));
    
    // Calculate fertile window
    const ovulationDate = new Date(cycleStartDate);
    ovulationDate.setDate(cycleStartDate.getDate() + ovulationDay);
    
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);
    
    return {
      isActive: true,
      dayOfCycle,
      currentPhase: phaseInfo.phase,
      phaseDescription: phaseInfo.description,
      phaseTips: phaseInfo.tips,
      isFertile,
      cycleStartDate: latestCycle.start_date,
      nextPeriodDate: nextPeriodDate.toISOString().split('T')[0],
      periodWindow: {
        start: latestCycle.start_date,
        end: periodEnd.toISOString().split('T')[0]
      },
      fertileWindow: {
        start: fertileStart.toISOString().split('T')[0],
        end: fertileEnd.toISOString().split('T')[0]
      }
    };
  } catch (error) {
    console.error('Error getting current cycle status:', error);
    return null;
  }
}; 