import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Leader {
    name: string;
    role: string;
    title: string;
    image: string;
}

const leaders: Leader[] = [
    {
        name: "Pastor Keith Hall",
        role: "Executive Pastor",
        title: "Executive Pastor",
        image: "/images/leadership/pastor_keith_hall.png"
    },
    {
        name: "Pastor Erick Bowens",
        role: "Chief Ministry Liaison & Youth Pastor",
        title: "Chief Ministry Liaison & Youth and Young Adult Pastor",
        image: "/images/leadership/pastor_erick_bowens.png"
    },
    {
        name: "Pastor Jon Hatcher",
        role: "CMS of Chosen Vessel Everywhere",
        title: "Chief Ministry Servant: Pastor Jon Hatcher",
        image: "/images/leadership/pastor_jon_hatcher.png"
    },
    {
        name: "Pastor Rodney Fleming",
        role: "First Impressions",
        title: "Chief Ministry Servant: Pastor Rodney Fleming",
        image: "/images/leadership/pastor_rodney_fleming.png"
    },
    {
        name: "Pastor Shirley Gardner",
        role: "Congregational Care",
        title: "Chief Ministry Servant: Pastor Shirley Gardner",
        image: "/images/leadership/pastor_shirley_gardner.png"
    },
    {
        name: "Pastor Charles Rainbow",
        role: "Intake Christian Education",
        title: "Chief Ministry Servant: Pastor Charles Rainbow",
        image: "/images/leadership/pastor_charles_rainbow.png"
    },
    {
        name: "Pastor Paulette Smith",
        role: "Helps Ministry",
        title: "Chief Ministry Servant: Pastor Paulette Smith",
        image: "/images/leadership/pastor_paulette_smith.png"
    },
    {
        name: "Marvin Sapp, Jr.",
        role: "Social Media, Marketing & Communications",
        title: "Chief Ministry Servant: Marvin Sapp Jr",
        image: "/images/leadership/marvin_sapp_jr.png"
    },
    {
        name: "Deacon Isaac Cooper",
        role: "Deacons Ministry",
        title: "Chief Ministry Servant: Deacon Isaac Cooper",
        image: "/images/leadership/deacon_isaac_cooper.png"
    },
    {
        name: "Otis Dunn",
        role: "MoMENtum Men's Ministry",
        title: "Co-Chief Ministry Servant: Otis Dunn",
        image: "/images/leadership/otis_dunn.png"
    },
    {
        name: "Deacon Vincent Benn",
        role: "MoMENtum Men's Ministry",
        title: "Co-Chief Ministry Servant: Deacon Vincent Benn",
        image: "/images/leadership/deacon_vincent_benn.png"
    },
    {
        name: "Katrice Reed",
        role: "RefresHER Women's Ministry",
        title: "Co-Chief Ministry Servant: Katrice Reed",
        image: "/images/leadership/katrice_reed.png"
    },
    {
        name: "Deacon Dwayne & Ann Smith",
        role: "Married Couples Ministry",
        title: "Co-Chief Ministry Servants: Deacon Dwayne & Ann Smith",
        image: "/images/leadership/deacon_dwayne_ann_smith.jpg"
    },
    {
        name: "Voneca Bolden",
        role: "Culinary Arts Ministry",
        title: "Co-Chief Ministry Servant: Voneca Bolden",
        image: "/images/leadership/voneca_bolden.jpg"
    },
    {
        name: "Kendric Gray",
        role: "Media Ministry",
        title: "Chief Ministry Servant: Kendric Gray",
        image: "/images/leadership/kendric_gray.jpg"
    },
    {
        name: "Quanetta Dunn",
        role: "Campus Enhancement",
        title: "Co-Chief Ministry Servant: Quanetta Dunn",
        image: "/images/leadership/quanetta_dunn.jpg"
    },
    {
        name: "Jamal Bolden, Sr.",
        role: "Campus Enhancement",
        title: "Co-Chief Ministry Servant: Jamal Bolden",
        image: "/images/leadership/jamal_bolden_sr.jpg"
    },
    {
        name: "Whitney McDonald",
        role: "Dance Ministry",
        title: "Chief Ministry Servant: Whitney McDonald",
        image: "/images/leadership/whitney_mcdonald.jpg"
    },
    {
        name: "Jasmine Bowens",
        role: "Chosen Youth",
        title: "Co-Chief Ministry Servant: Jasmine Bowens",
        image: "/images/leadership/jasmine_bowens.jpg"
    },
    {
        name: "LaShawna Estis",
        role: "Chosen Youth",
        title: "Co-Chief Ministry Servant: LaShawna Estis",
        image: "/images/leadership/lashawna_estis.jpg"
    },
    {
        name: "Rocille Willingham",
        role: "Valet/Brother Servants",
        title: "Co-Chief Ministry Servant: Rocille Willingham",
        image: "/images/leadership/rocille_willingham.jpg"
    },
    {
        name: "Claude Watkins",
        role: "Valet/Brother Servants",
        title: "Co-Chief Ministry Servant: Claude Watkins",
        image: "/images/leadership/claude_watkins.jpg"
    },
    {
        name: "Katina Clay",
        role: "Membership Services",
        title: "Chief Ministry Servant: Katina Clay",
        image: "/images/leadership/katina_clay.jpg"
    },
    {
        name: "Felicia Fuller",
        role: "ACTS Ministry",
        title: "Chief Ministry Servant: Felicia Fuller",
        image: "/images/leadership/felicia_fuller.jpg"
    },
    {
        name: "Johnnie Durham",
        role: "Sacred Hearts",
        title: "Chief Ministry Servant: Johnnie Durham",
        image: "/images/leadership/johnnie_durham.jpg"
    },
    {
        name: "Fay Holbert",
        role: "Health & Wellness (ICARE)",
        title: "Chief Ministry Servant: Fay Holbert",
        image: "/images/leadership/fay_holbert.jpg"
    }
];

export default function LeadershipPage() {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".header-content", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            // Grid Animation
            const cards = gsap.utils.toArray(".leader-card") as HTMLElement[];

            cards.forEach((card) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%", // Start whenever the card enters the viewport
                        toggleActions: "play none none none" // Play once and stay visible
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });
            });

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className="bg-neutral-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="header-content text-center mb-20 max-w-3xl mx-auto">
                    <span className="text-accent-teal font-bold tracking-widest text-sm uppercase">Meet Our People</span>
                    <h1 className="text-4xl md:text-6xl font-montserrat font-bold text-primary mt-4 mb-6">
                        Dedication. Expertise. Passion.
                    </h1>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                        Introducing our team of passionate ministry servants who are committed to driving our vision forward for our leadership. With their dedication and hard work, we are able to achieve our goals and make a positive impact in our community. Get to know our team and join us in our mission to make a difference.
                    </p>
                </div>

                {/* Grid */}
                <div className="leaders-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {leaders.map((leader, idx) => (
                        <div key={idx} className="leader-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100">
                            {/* Image Container */}
                            <div className="aspect-[4/5] overflow-hidden relative bg-neutral-100">
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 z-10" />
                                <img
                                    src={leader.image}
                                    alt={leader.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-primary font-montserrat mb-1">{leader.name}</h3>
                                <p className="text-accent-teal text-sm font-bold uppercase tracking-wide mb-3">{leader.role}</p>
                                <div className="h-px bg-neutral-100 w-full mb-3" />
                                <p className="text-neutral-500 text-sm font-medium">
                                    {leader.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
