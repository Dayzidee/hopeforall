import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Ministries() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".ministry-card",
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: ".ministry-grid",
                        start: "top 80%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const ministries = [
        {
            title: "MoMENtum Men's Ministry",
            image: "https://static.wixstatic.com/media/ce7f0e_fc3a6392000348b3a3638eaf2f2aecac~mv2.png/v1/fill/w_316,h_277,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ce7f0e_fc3a6392000348b3a3638eaf2f2aecac~mv2.png",
            color: "border-blue-500"
        },
        {
            title: "Sunday School",
            image: "https://static.wixstatic.com/media/ce7f0e_5a5d9d7481be44958f1c352ddd7df844~mv2.png/v1/fill/w_319,h_277,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ce7f0e_5a5d9d7481be44958f1c352ddd7df844~mv2.png",
            color: "border-yellow-500"
        },
        {
            title: "Music and Fine Arts",
            image: "https://static.wixstatic.com/media/ce7f0e_1ba89aed94e74555ae06f6eb90c7e4c4~mv2.png/v1/fill/w_319,h_277,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ce7f0e_1ba89aed94e74555ae06f6eb90c7e4c4~mv2.png",
            color: "border-purple-500"
        },
        {
            title: "RefresHER Women's Ministry",
            image: "https://static.wixstatic.com/media/ce7f0e_5d9644c7e50f4abc8234ae9cbcb9f317~mv2.png/v1/fill/w_440,h_379,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ce7f0e_5d9644c7e50f4abc8234ae9cbcb9f317~mv2.png",
            color: "border-pink-500"
        },
        {
            title: "Chosen Youth",
            image: "https://static.wixstatic.com/media/ce7f0e_f830b154851c4f0da0ea12c04f3d6321~mv2.png/v1/fill/w_440,h_379,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ce7f0e_f830b154851c4f0da0ea12c04f3d6321~mv2.png",
            color: "border-teal-500"
        }
    ];

    return (
        <section id="ministries" ref={sectionRef} className="py-24 bg-neutral-50 scroll-mt-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Ministries Intro */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-montserrat font-bold text-primary mb-6">Our Ministries</h2>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                        Everyone has to be filled up before they can overflow. Cultivating outflow at TCVC requires taking personal time with Jesus to get filled up. Our array of ministries are designed to help point you to Christ, explore the character of Christ, and reveal the will of Christ for your life.
                    </p>
                </div>

                {/* Ministry Cards Grid */}
                <div className="ministry-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-24">
                    {ministries.map((ministry, idx) => (
                        <div key={idx} className={`ministry-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 max-w-sm w-full border-b-4 ${ministry.color}`}>
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={ministry.image}
                                    alt={ministry.title}
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-primary font-montserrat">{ministry.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mission Context */}
                <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-0"></div>
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-accent-gold">Global Mission</h2>
                        <p className="text-lg md:text-xl leading-relaxed opacity-90">
                            TCVC ministries are equipping Christians and presenting opportunities to reach beyond their comfort zone. Help us create an outflow momentum within TCVC, by offering your knowledge and experience to find ways to reach out to the ends of the earth. Together, we can watch more people begin thirsting for the living water they see splashing out all around us. It will get harder and harder not to get swept up and into this life they were destined to live – on Sunday morning and all seven days of the week.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
