import { useRef, useEffect } from "react";

import { CheckCircle } from "lucide-react";

export default function Outreach() {
    const containerRef = useRef(null);

    useEffect(() => {
        // Animation logic can be expanded here
    }, []);

    return (
        <section id="outreach" ref={containerRef} className="py-24 bg-white overflow-hidden scroll-mt-28">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Charity Section */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
                    <div className="lg:w-1/2 relative">
                        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-accent-gold rounded-2xl z-0" />
                        <img
                            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop"
                            alt="Community Charity"
                            className="relative z-10 rounded-2xl shadow-2xl w-full object-cover h-[300px] sm:h-[400px] lg:h-[500px]"
                        />
                        <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs animate-bounce hidden md:block">
                            <p className="text-4xl font-bold text-accent-teal">5,000+</p>
                            <p className="text-neutral-600 font-medium">Lives touched this year</p>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <span className="text-accent-teal font-bold tracking-widest text-sm uppercase">Community Impact</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-primary mt-4 mb-6 md:mb-8">
                            Hope in Action
                        </h2>
                        <p className="text-base sm:text-lg text-neutral-600 mb-8 leading-relaxed">
                            We believe faith without works is dead. Our ministry is deeply committed to practical acts of love, providing food, shelter, and support to the most vulnerable in our society.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Weekly Food Drive & Pantry",
                                "Educational Scholarships for Youth",
                                "Homeless Shelter Support Program",
                                "Medical Outreach Missions"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-neutral-700 font-medium">
                                    <CheckCircle className="w-5 h-5 text-accent-teal" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-light transition-colors shadow-lg">
                            Volunteer With Us
                        </button>
                    </div>
                </div>

                {/* Environmental Section (Reversed Layout) */}
                <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                    <div className="lg:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop"
                            alt="Environmental Work"
                            className="rounded-2xl shadow-2xl w-full object-cover h-[300px] sm:h-[400px] lg:h-[500px]"
                        />
                    </div>

                    <div className="lg:w-1/2">
                        <span className="text-accent-gold font-bold tracking-widest text-sm uppercase">Stewardship</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-primary mt-4 mb-6 md:mb-8">
                            Caring for Creation
                        </h2>
                        <p className="text-base sm:text-lg text-neutral-600 mb-8 leading-relaxed">
                            As stewards of God's earth, we are dedicated to environmental sustainability. From local cleanup drives to tree planting initiatives, we are making our community greener and cleaner.
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                                <h4 className="text-3xl font-bold text-primary mb-2">1,200</h4>
                                <p className="text-sm text-neutral-500">Trees Planted</p>
                            </div>
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                                <h4 className="text-3xl font-bold text-primary mb-2">50+</h4>
                                <p className="text-sm text-neutral-500">Cleanup Drives</p>
                            </div>
                        </div>

                        <button className="px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-lg hover:bg-neutral-50 transition-colors">
                            See Our Projects
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
