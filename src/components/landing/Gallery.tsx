import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray(".gallery-item") as HTMLElement[];

            items.forEach((item) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%", // Start when item enters viewport
                        toggleActions: "play none none none"
                    },
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const images = [
        { src: "/images/gallery/worship.jpg", alt: "Worship Experience", span: true },
        { src: "/images/gallery/community.jpg", alt: "Community Fellowship", span: false },
        { src: "/images/gallery/service.jpg", alt: "Service & Prayer", span: false },
        { src: "/images/gallery/outreach.jpg", alt: "Community Outreach", span: false },
        { src: "/images/gallery/graduation.jpg", alt: "Celebrating Milestones", span: false },
        { src: "/images/gallery/teaching.jpg", alt: "Biblical Teaching", span: true },
        { src: "/images/gallery/youth.jpg", alt: "Chosen Youth", span: false },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-montserrat font-bold text-neutral-800">
                    Moments at The Chosen Vessel
                </h2>
                <div className="w-20 h-1 bg-accent-teal mx-auto mt-6 mb-6 rounded-full"></div>
                <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                    Capturing the spirit, energy, and joy of our congregation.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16" ref={sectionRef}>
                {images.map((img, idx) => (
                    <div key={idx} className={`gallery-item relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group ${img.span ? 'md:col-span-2 md:row-span-2' : ''}`}>
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/${img.span ? '800x800' : '400x400'}/1E293B/FFFFFF?text=${img.alt}`; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-montserrat font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.alt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
