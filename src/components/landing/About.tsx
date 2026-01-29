import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Award, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate the main container
            gsap.fromTo(".about-container",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            );

            // Animate cards staggered
            gsap.fromTo(".about-card",
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: ".about-grid",
                        start: "top 85%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out"
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const values = [
        {
            title: "Faith",
            description: "We invite you to come check us out this weekend at one of our worship services. We know that going to a new church can be confusing and intimidating, so we try to do things in a way where you’ll feel welcome.",
            icon: <Shield className="w-8 h-8" />,
            color: "from-teal-400 to-teal-600",
            bg: "bg-teal-50"
        },
        {
            title: "Family",
            description: "We value the family and we believe church should be a place for people of all ages. Every Sunday we provide youth ministry alongside our regular services, which provides an age-appropriate environment for youth to encounter Christ.",
            icon: <Users className="w-8 h-8" />,
            color: "from-amber-400 to-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "Leadership",
            description: "We are guided by a dedicated leadership team of pastors that provide sound, practical, biblical teaching at each worship service.",
            icon: <Award className="w-8 h-8" />,
            color: "from-blue-400 to-blue-600",
            bg: "bg-blue-50"
        }
    ];

    return (
        <div id="about" ref={sectionRef} className="pb-24 pt-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24 md:scroll-mt-32">
            <div className="about-container glass-panel p-6 sm:p-10 md:p-14 rounded-3xl relative overflow-hidden border border-white/40 shadow-2xl">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-teal via-primary to-accent-gold"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-teal/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8 md:mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/5 text-primary text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 border border-primary/10">
                            Our Mission
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat text-primary font-bold mb-6 md:mb-8">
                            About The Chosen Vessel
                        </h2>

                        <div className="max-w-4xl mx-auto text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
                            <p>
                                The Chosen Vessel is a dynamic church located in Fort Worth, TX. Our beliefs are based on the Bible and centered on <span className="font-bold text-primary">Jesus Christ</span>. Our mission is very simple: to lead people to honor and glorify Jesus Christ. That means we’re not about a building or some complicated religious system, but about helping people from all backgrounds discover the joy that comes from knowing and serving Jesus Christ.
                            </p>
                        </div>
                    </div>

                    <div className="about-grid grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                        {values.map((item, idx) => (
                            <div key={idx} className="about-card group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-neutral-100 overflow-hidden">

                                {/* Card Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 rounded-2xl`}></div>
                                    <div className="text-gray-700">
                                        {item.icon}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-montserrat font-bold text-primary mb-4 relative z-10">{item.title}</h3>
                                <p className="text-neutral-600 leading-relaxed relative z-10 text-base">
                                    {item.description}
                                </p>

                                <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
