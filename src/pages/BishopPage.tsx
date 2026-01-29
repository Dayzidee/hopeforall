import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const bishopImage = "/bishop_sapp_new.png";

gsap.registerPlugin(ScrollTrigger);

export default function BishopPage() {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.from(".hero-content", {
                y: 50,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: "power3.out"
            });

            gsap.from(".hero-image", {
                x: 50,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: "power3.out"
            });

            // Sections Animation
            gsap.utils.toArray<HTMLElement>(".content-section").forEach((section) => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className="bg-neutral-50 min-h-screen">
            {/* Hero Section */}
            <header className="relative bg-primary min-h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544427920-c49cc113ff6e?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
                    <div className="hero-content space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-accent-gold/20 border border-accent-gold/30 rounded-full">
                            <span className="text-accent-gold font-bold tracking-widest text-sm uppercase">Senior Pastor & Metropolitan Bishop</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold font-montserrat text-white leading-tight">
                            Bishop <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Marvin L. Sapp</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                            A passionate orator and biblical teacher, desiring to be a living epistle glorifying our Lord and Savior Jesus Christ both in word and in deed.
                        </p>
                        <div className="h-1 w-24 bg-accent-teal rounded-full mt-8"></div>
                    </div>

                    <div className="hero-image relative h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10 mix-blend-multiply"></div>
                        <img
                            src={bishopImage}
                            alt="Bishop Marvin L. Sapp"
                            className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-24 space-y-24">

                {/* Introduction */}
                <section className="content-section text-lg text-neutral-600 leading-relaxed space-y-6">
                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-accent-teal first-letter:mr-3 first-letter:float-left">
                        Bishop Marvin L. Sapp is the Co-Founder of Lighthouse Full Life Center Church in Grand Rapids, Michigan and the Senior Pastor of The Chosen Vessel Cathedral in Fort Worth, Texas as well as a Metropolitan Bishop that oversees more than 100 churches in the Central Deanery of Global United Fellowship.
                    </p>
                    <p>
                        Many say his voice is instantly recognizable with a characteristically raspy ringing with power and authority as he masterfully illustrates with excellence the Word of God. Not only is his delivery exemplary, but his knowledge of the historical text brings to life the message of hope and healing.
                    </p>
                </section>

                {/* Quote 1 */}
                <section className="content-section">
                    <div className="bg-primary p-12 rounded-3xl relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 text-9xl text-white/5 font-serif">"</div>
                        <blockquote className="relative z-10 text-2xl md:text-3xl font-montserrat font-bold text-white italic">
                            “Not a singer that happens to preach, but a Preacher called by God who is gifted to sing”
                        </blockquote>
                    </div>
                </section>

                {/* Musical Journey */}
                <section className="content-section">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-neutral-200 flex-1"></div>
                        <h2 className="text-3xl font-bold font-montserrat text-primary uppercase tracking-widest">Musical Journey</h2>
                        <div className="h-px bg-neutral-200 flex-1"></div>
                    </div>
                    <div className="space-y-6 text-neutral-600 leading-relaxed">
                        <p>
                            Singing since age four, he has shared the stage with many gospel notables and his gift is celebrated across musical genres. He began singing with the gospel group <span className="font-semibold text-primary">Commissioned</span> in 1990. In 1996, God led him to go solo.
                        </p>
                        <p>
                            He released his first CD "Marvin Sapp", followed by "Grace and Mercy". His discography continued to grow with notable releases such as "Nothing Else Matters", "I Believe", "Diary Of A Psalmist", "Be Exalted", "Thirsty", "Here I Am", and "I Win". In 2013, he released his Christmas Card CD featured his three children.
                        </p>
                        <div className="bg-white p-6 rounded-xl border-l-4 border-accent-gold shadow-sm my-8">
                            <p className="italic text-neutral-700">
                                The backdrop for the CD "I Win" came from him mitigating the pain of the loss of his wife through conversations with God.
                            </p>
                        </div>
                        <p>
                            The title "Here I Am" for gospel star Marvin Sapp is more than a little ironic when one considers that, "Never Would Have Made It" from his 2007 release "Thirsty" has been among the most ubiquitous gospel and R&B songs. According to Billboard, Marvin Sapp's single "Best In Me" matched the 2008 peak of his seminal "Never Would Have Made It."
                        </p>
                        <p>
                            The mega-selling <span className="font-bold text-accent-teal">"Never Would Have Made It"</span> held the #1 slot on Gospel and R&B radio for over a full year; topped the Urban AC chart (the first to do so since Yolanda Adams' "Open My Heart") and has the top selling ringtone and ring back (2 million sales), and propelled "Thirsty" to the top of the gospel charts for 28 weeks.
                        </p>
                    </div>
                </section>

                {/* Resilience */}
                <section className="content-section bg-neutral-100 -mx-6 md:-mx-12 p-8 md:p-12 rounded-3xl">
                    <h3 className="text-2xl font-bold font-montserrat text-primary mb-4">Triumph Over Tragedy</h3>
                    <p className="text-neutral-600 leading-relaxed">
                        But for the celebrated pastor, being dragged to the depths of his grief and drowning was never an option. Following the loss of his beloved wife of 18 years to cancer, preceded by the untimely deaths of his biological father, spiritual father, and musical mentor; Sapp still had three children (Marvin II, MiKaila, and Madisson) to raise, an influential church to run, entrepreneurial ventures and a thriving musical career to maintain.
                    </p>
                    <p className="mt-4 text-neutral-600 leading-relaxed">
                        He poured his swirling emotions into his craft, crediting the cathartic creative process with the release of his stunning revelatory decree <em>You Shall Live</em>. <em>You Shall Live</em>, featuring the hit radio single <em>Yes You Can</em>, was released on June 2, 2015. His eleventh album <em>Close</em> was released on September 29, 2017.
                    </p>
                </section>

                {/* Awards */}
                <section className="content-section">
                    <h2 className="text-3xl font-bold font-montserrat text-primary mb-8 text-center">Decorated Career</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            { count: "11", label: "Grammy Nominations" },
                            { count: "24", label: "Stellar Awards" },
                            { count: "2", label: "Soul Train Awards" },
                            { count: "2", label: "BET Awards" },
                            { count: "3", label: "Dove Awards" },
                            { count: "8", label: "BMI Songwriter Awards" }
                        ].map((award, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl text-center shadow-lg hover:-translate-y-1 transition-transform duration-300 border border-neutral-100">
                                <span className="block text-4xl font-bold text-accent-gold mb-2">{award.count}</span>
                                <span className="text-sm font-bold text-primary uppercase tracking-wider">{award.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quote 2 */}
                <section className="content-section">
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="w-16 h-1 bg-accent-teal block mx-auto mb-6"></span>
                        <h3 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-6">
                            “Not Complacent, yet pressing towards the mark”
                        </h3>
                    </div>
                </section>

                {/* Philanthropy */}
                <section className="content-section space-y-6 text-neutral-600 leading-relaxed pb-12 border-b border-neutral-200">
                    <p>
                        Bishop Sapp has been honored and recognized for his professional and philanthropic efforts in his home city, Grand Rapids, Michigan. He received the city’s highest African American honor, <span className="font-bold text-primary">Giant of Giants Award</span>, as well as the <span className="font-bold text-primary">Frederick Douglas Award</span> from the National Association of Negro and Professional Women’s Club.
                    </p>
                    <p>
                        He is an established author of eight books. The seventh book is titled "Recreation" and the eighth book is titled "Suitable" which were both released July 2018. He is also an entrepreneur illustrating success in various areas of business.
                    </p>
                </section>

            </main>
        </div>
    );
}
