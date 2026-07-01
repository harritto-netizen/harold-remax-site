import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Award, Clock, Users } from 'lucide-react';

function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let frame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, start]);

  return count;
}

export default function AnimatedStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const propertiesSold = useCountUp(500, 2000, visible);
  const yearsExperience = useCountUp(15, 1800, visible);
  const avgDaysToClose = useCountUp(45, 1600, visible);
  const happyClients = useCountUp(350, 2000, visible);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-charcoal relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cream rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cream rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-lato text-xs uppercase tracking-widest text-cream/50 mb-4">
            Proven Track Record
          </p>
          <h2 className="font-montserrat text-4xl sm:text-5xl font-light text-cream uppercase tracking-wider">
            Results That Speak
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div
            className={`text-center transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 border border-cream/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cream/70" />
              </div>
            </div>
            <p className="font-montserrat text-5xl sm:text-6xl font-light text-cream mb-2">
              {propertiesSold}+
            </p>
            <p className="font-lato text-xs sm:text-sm text-cream/60 uppercase tracking-widest">
              Properties Sold
            </p>
          </div>

          <div
            className={`text-center transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 border border-cream/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-cream/70" />
              </div>
            </div>
            <p className="font-montserrat text-5xl sm:text-6xl font-light text-cream mb-2">
              {yearsExperience}+
            </p>
            <p className="font-lato text-xs sm:text-sm text-cream/60 uppercase tracking-widest">
              Years Experience
            </p>
          </div>

          <div
            className={`text-center transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 border border-cream/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-cream/70" />
              </div>
            </div>
            <p className="font-montserrat text-5xl sm:text-6xl font-light text-cream mb-2">
              {avgDaysToClose}
            </p>
            <p className="font-lato text-xs sm:text-sm text-cream/60 uppercase tracking-widest">
              Avg. Days to Close
            </p>
          </div>

          <div
            className={`text-center transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '450ms' }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 border border-cream/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-cream/70" />
              </div>
            </div>
            <p className="font-montserrat text-5xl sm:text-6xl font-light text-cream mb-2">
              {happyClients}+
            </p>
            <p className="font-lato text-xs sm:text-sm text-cream/60 uppercase tracking-widest">
              Happy Clients
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
