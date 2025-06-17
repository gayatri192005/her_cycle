
import React, { useRef, useEffect } from 'react';
import { Calendar, LineChart, Heart, ShieldCheck } from 'lucide-react';

const featureItems = [
  {
    icon: Calendar,
    title: "Precise Cycle Tracking",
    description: "Keep track of your menstrual cycle with accuracy and elegance. Predict your next period with personalized insights.",
    color: "bg-hercycle-rose",
    textColor: "text-hercycle-deepPink"
  },
  {
    icon: LineChart,
    title: "Cycle Analysis",
    description: "Understand your patterns over time with beautiful visualizations and insightful statistics about your cycle.",
    color: "bg-hercycle-lavender",
    textColor: "text-purple-700"
  },
  {
    icon: Heart,
    title: "Symptom Logging",
    description: "Track your mood, symptoms, and energy levels to better understand your body throughout your cycle.",
    color: "bg-hercycle-softBlue",
    textColor: "text-blue-600"
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "Your data is yours. We prioritize your privacy with end-to-end encryption and no third-party data sharing.",
    color: "bg-green-100",
    textColor: "text-green-700"
  }
];

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      {
        threshold: 0.1,
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="py-24 px-6 md:px-10 section-transition"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-hercycle-rose text-hercycle-deepPink text-sm font-medium py-1 px-3 rounded-full inline-flex items-center">
              <span>Features</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Everything you need to track your cycle</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-lg text-balance">
            HerCycle combines beautiful design with powerful features to give you the best period tracking experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureItems.map((feature, index) => (
            <div key={index} className="glass-card hercycle-border hercycle-shadow overflow-hidden group hover:translate-y-[-4px] transition-all">
              <div className="flex items-start p-6">
                <div className={`${feature.color} p-3 rounded-xl ${feature.textColor} mr-5`}>
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
