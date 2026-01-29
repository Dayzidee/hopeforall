import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Heart, Music } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Mission() {
  const sectionRef = useRef(null);

  // Use useLayoutEffect for better GSAP initialization with React
  // Removed ScrollTrigger for now to ensure visibility as the negative margin might be affecting start/end points
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".mission-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.2 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const missions = [
    {
      title: "Worship",
      description: "Experience powerful, spirit-filled worship that connects you directly with the divine presence.",
      icon: <Music className="w-8 h-8" />,
      color: "bg-accent-teal"
    },
    {
      title: "Community",
      description: "The Chosen Vessel is more than a church; it's a family where everyone is welcome, supported, and loved.",
      icon: <Users className="w-8 h-8" />,
      color: "bg-accent-gold"
    },
    {
      title: "Outreach",
      description: "Extending our hands beyond the walls to serve, heal, and bring hope to our city.",
      icon: <Heart className="w-8 h-8" />,
      color: "bg-primary-light"
    }
  ];

  return (
    <div id="mission" ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {missions.map((item, idx) => (
        <div key={idx} className="mission-card group relative overflow-hidden bg-white p-8 rounded-2xl shadow-lg border border-neutral-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
            {item.icon}
          </div>
          <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">{item.title}</h3>
          <p className="text-neutral-600 leading-relaxed">
            {item.description}
          </p>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent-teal to-accent-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>
      ))}
    </div>
  );
}
