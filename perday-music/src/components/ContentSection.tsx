import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ContentSectionProps {
  title: string;
  description: string;
  features: string[];
  className?: string;
}

export default function ContentSection({ title, description, features, className = '' }: ContentSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Main section entrance animation
    gsap.fromTo(sectionRef.current,
      {
        opacity: 0,
        y: 100
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Title animation with split effect
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Description fade in
    if (descriptionRef.current) {
      gsap.fromTo(descriptionRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          delay: 0.2
        }
      );
    }

    // Feature cards stagger animation
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');
      gsap.fromTo(featureCards,
        {
          opacity: 0,
          y: 60,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-4 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {title}
          </h2>
          <p
            ref={descriptionRef}
            className="text-xl text-cyan-300/80 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </p>
        </div>

        {/* Feature Grid */}
        <div
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 card-grid"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card card group"
            >
              <div className="bg-gradient-to-br from-synth-violet/20 to-synth-magenta/20 backdrop-blur-sm border border-synth-violet/30 rounded-2xl p-6 h-full transition-all duration-300 hover:border-synth-violet/60 hover:shadow-[0_0_30px_rgba(108,26,237,0.3)]">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {feature}
                </h3>
                <p className="text-synth-violet/70 leading-relaxed">
                  Experience the power of structured creativity with our advanced gamification system.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-synth-violet to-synth-magenta hover:from-synth-magenta hover:to-synth-violet text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-synth-violet/25 transition-all duration-300 transform hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}
