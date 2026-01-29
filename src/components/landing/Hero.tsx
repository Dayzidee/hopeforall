import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(textRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(btnRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary py-20 md:py-0">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/90 via-primary/80 to-primary-light/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop"
          alt="Worship Background"
          className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow object-center"
        />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-accent-teal/20 rounded-full blur-[80px] md:blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-accent-gold/20 rounded-full blur-[80px] md:blur-[100px] animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto mt-10 md:mt-0">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
          <span className="text-accent-teal font-medium tracking-wide text-xs sm:text-sm uppercase">Welcome to The Chosen Vessel</span>
        </div>

        <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-montserrat font-bold text-white mb-6 md:mb-8 tracking-tight leading-tight">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-gold">Sanctuary</span>
        </h1>

        <p ref={textRef} className="text-base sm:text-lg md:text-2xl text-neutral-200 mb-8 md:mb-12 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light px-2">
          A place where faith meets community. Join us in our mission to bring hope, healing, and purpose to every life we touch.
        </p>

        <div ref={btnRef} className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
          <Link to="/dashboard/live" className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-accent-teal hover:bg-teal-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] transition-all duration-300 transform hover:-translate-y-1 block text-center">
            Join Service Live
          </Link>
          <a href="#ministries" className="w-full sm:w-auto px-8 py-3.5 sm:py-4 glass-panel border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 block text-center">
            Our Ministries
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
