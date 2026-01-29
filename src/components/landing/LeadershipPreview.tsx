import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const previewLeaders = [
    {
        name: "Pastor Keith Hall",
        role: "Executive Pastor",
        image: "/images/leadership/pastor_keith_hall.png"
    },
    {
        name: "Pastor Erick Bowens",
        role: "Chief Ministry Liaison",
        image: "/images/leadership/pastor_erick_bowens.png"
    },
    {
        name: "Pastor Jon Hatcher",
        role: "CMS of Chosen Vessel Everywhere",
        image: "/images/leadership/pastor_jon_hatcher.png"
    },
    {
        name: "Pastor Rodney Fleming",
        role: "First Impressions",
        image: "/images/leadership/pastor_rodney_fleming.png"
    }
];

export default function LeadershipPreview() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".preview-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-neutral-50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Side */}
                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <span className="text-accent-teal font-bold tracking-widest text-sm uppercase">Meet Our Team</span>
                            <h2 className="text-4xl sm:text-5xl font-montserrat font-bold text-primary mt-2">
                                Dedication. Expertise. Passion.
                            </h2>
                            <div className="w-20 h-1.5 bg-accent-gold mt-6 rounded-full" />
                        </div>

                        <p className="text-lg text-neutral-600 leading-relaxed">
                            Introducing our team of passionate ministry servants who are committed to driving our vision forward. With their dedication and hard work, we are able to make a positive impact in our community.
                        </p>

                        <Link
                            to="/leadership"
                            className="inline-flex items-center gap-2 bg-white text-primary border border-neutral-200 px-8 py-4 rounded-full font-bold hover:bg-neutral-50 transition-all duration-300 group shadow-lg hover:shadow-xl"
                        >
                            View Full Team
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-accent-teal" />
                        </Link>
                    </div>

                    {/* Grid Side */}
                    <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                        {previewLeaders.map((leader, idx) => (
                            <div key={idx} className={`preview-card relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5] ${idx % 2 === 1 ? 'mt-8' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent z-10" />
                                <img
                                    src={leader.image}
                                    alt={leader.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 w-full p-4 z-20 text-white">
                                    <p className="font-bold text-sm">{leader.name}</p>
                                    <p className="text-xs text-accent-gold/90 truncate">{leader.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
