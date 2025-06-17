
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';

const Hero = () => {
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
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center items-center pt-20 pb-20 px-6 md:px-10 section-transition"
      style={{ backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(255, 182, 193, 0.15) 0%, rgba(255, 255, 255, 0) 50%)' }}
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col space-y-8">
          <div>
            <div className="inline-block animate-fade-in">
              <div className="bg-hercycle-rose text-hercycle-deepPink text-sm font-medium py-1 px-3 rounded-full mb-6 inline-flex items-center">
                <span>Designed for your cycle</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight md:leading-tight lg:leading-tight animate-fade-in">
              Track your cycle with 
              <span className="text-hercycle-deepPink"> elegance</span> and 
              <span className="text-hercycle-deepPink"> precision</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl text-balance animate-fade-in animate-delay-200">
              HerCycle helps you understand your body better with thoughtful design, powerful insights, and a personal approach to period tracking.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-300">
            <Button asChild size="lg" className="bg-hercycle-deepPink hover:bg-hercycle-deepPink/90 text-white rounded-full px-8 h-12">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 group">
              <Link to="/#features" className="flex items-center">
                Learn More
                <ChevronRight size={18} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="hidden lg:flex justify-center items-center animate-fade-in animate-delay-400">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-64 h-64 bg-hercycle-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute top-0 -right-4 w-64 h-64 bg-hercycle-rose rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>
            <div className="absolute bottom-24 left-20 w-64 h-64 bg-hercycle-softBlue rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-4000"></div>
            
            <div className="relative glass-card hercycle-shadow mx-auto p-8 max-w-md">
              <div className="flex justify-center mb-6">
                <div className="bg-hercycle-deepPink/10 p-4 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-hercycle-pink flex items-center justify-center">
                    <span className="text-hercycle-deepPink font-semibold text-lg">15</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-center mb-4">Your Cycle Overview</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Next period in</span>
                  <span className="font-medium">15 days</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-hercycle-deepPink h-2.5 rounded-full" style={{ width: "65%" }}></div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="glass-card p-3 flex flex-col items-center">
                    <span className="text-xs text-foreground/70">Cycle</span>
                    <span className="font-medium">29 days</span>
                  </div>
                  <div className="glass-card p-3 flex flex-col items-center">
                    <span className="text-xs text-foreground/70">Period</span>
                    <span className="font-medium">5 days</span>
                  </div>
                  <div className="glass-card p-3 flex flex-col items-center">
                    <span className="text-xs text-foreground/70">Phase</span>
                    <span className="font-medium">Luteal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <ChevronRight size={24} className="rotate-90 text-foreground/40" />
      </div>
    </section>
  );
};

export default Hero;
