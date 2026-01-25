import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Mission() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mission-card", {
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="mission" ref={sectionRef} className="py-20 sm:py-28 bg-white-text">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-montserrat font-bold text-primary-blue">
              Our Pillars of Faith
            </h2>
            <p className="mt-6 text-xl text-dark-text max-w-3xl mx-auto leading-relaxed">
              Foundational principles that guide our community and spiritual growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
            {/* Worship */}
            <div className="mission-card bg-light-background rounded-2xl p-8 border-2 border-primary-blue/10 hover:shadow-2xl hover:border-accent-teal/50 transition-all duration-300">
              <div className="w-16 h-16 bg-accent-teal rounded-full flex items-center justify-center mb-6 text-white-text font-bold text-2xl">
                 W
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-primary-blue mb-4">Worship</h3>
              <p className="text-dark-text leading-relaxed">
                Experience powerful worship sessions that connect you directly with the divine. Our services are designed to uplift your spirit and strengthen your faith.
              </p>
            </div>

            {/* Community */}
            <div className="mission-card bg-light-background rounded-2xl p-8 border-2 border-primary-blue/10 hover:shadow-2xl hover:border-accent-teal/50 transition-all duration-300">
              <div className="w-16 h-16 bg-accent-teal rounded-full flex items-center justify-center mb-6 text-white-text font-bold text-2xl">
                 C
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-primary-blue mb-4">Community</h3>
              <p className="text-dark-text leading-relaxed">
                We believe in the power of togetherness. Vessel is more than a church; it's a family where everyone is welcome, supported, and loved.
              </p>
            </div>

            {/* Outreach */}
            <div className="mission-card bg-light-background rounded-2xl p-8 border-2 border-primary-blue/10 hover:shadow-2xl hover:border-accent-teal/50 transition-all duration-300">
              <div className="w-16 h-16 bg-accent-teal rounded-full flex items-center justify-center mb-6 text-white-text font-bold text-2xl">
                 O
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-primary-blue mb-4">Outreach</h3>
              <p className="text-dark-text leading-relaxed">
                Extending our hands beyond the walls of the church to serve the needy, heal the broken, and bring hope to the hopeless in our society.
              </p>
            </div>
          </div>
        </div>
    </section>
  );
}
