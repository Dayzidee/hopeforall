import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const bishopImage = "/bishop_sapp_new.png";

gsap.registerPlugin(ScrollTrigger);

export default function Pastorate() {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(contentRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                x: -50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            gsap.from(imageRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                x: 50,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power3.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="leadership" ref={sectionRef} className="py-24 bg-white overflow-hidden scroll-mt-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content Side */}
                    <div ref={contentRef} className="space-y-8">
                        <div>
                            <span className="text-accent-teal font-bold tracking-widest text-sm uppercase">Senior Pastor</span>
                            <h2 className="text-4xl sm:text-5xl font-montserrat font-bold text-primary mt-2 leading-tight">
                                Bishop Marvin L. Sapp
                            </h2>
                            <div className="w-24 h-1.5 bg-accent-gold mt-6 rounded-full" />
                        </div>

                        <div className="text-lg text-neutral-600 space-y-4 leading-relaxed">
                            <p>
                                A passionate orator and biblical teacher, who desires to be a living epistle glorifying our Lord and Savior Jesus Christ. As the Senior Pastor of The Chosen Vessel Cathedral, his voice is instantly recognizable with power and authority as he masterfully illustrates the Word of God.
                            </p>
                            <p className="font-medium text-primary/80 italic border-l-4 border-accent-teal pl-4 py-2">
                                “Not a singer that happens to preach, but a Preacher called by God who is gifted to sing”
                            </p>
                        </div>

                        <Link
                            to="/leadership/bishop-sapp"
                            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Read Full Biography
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Image Side */}
                    <div ref={imageRef} className="relative">
                        <div className="absolute inset-0 bg-accent-gold/10 rounded-tr-[100px] rounded-bl-[100px] transform translate-x-4 translate-y-4"></div>
                        <div className="relative rounded-tr-[100px] rounded-bl-[100px] overflow-hidden shadow-2xl h-[400px] sm:h-[500px] lg:h-[600px] group">
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 z-10"></div>
                            <img
                                src={bishopImage}
                                alt="Bishop Marvin L. Sapp"
                                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Floating Stats Card - Optional visual element */}
                            <div className="absolute bottom-8 right-8 z-20 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl hidden sm:block max-w-xs border border-white/50">
                                <p className="text-accent-teal font-bold text-sm uppercase mb-1">Global Impact</p>
                                <p className="text-primary font-bold text-lg">Overseeing 100+ Churches</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
