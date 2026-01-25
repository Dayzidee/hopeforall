import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".gallery-item", {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const images = [
      { src: "/images/deski-jayantoro-Lolef9QKdtU-unsplash.jpg", alt: "Worship", span: true },
      { src: "/images/haseeb-modi-OcDJhBm8Jnc-unsplash.jpg", alt: "Community", span: false },
      { src: "/images/herlambang-tinasih-gusti-jsF0znM5uHk-unsplash.jpg", alt: "Service", span: false },
      { src: "/images/jerry-wang-KV9F7Ypl2N0-unsplash.jpg", alt: "Outreach", span: false },
      { src: "/images/markus-spiske-lYGnhDJIe9M-unsplash.jpg", alt: "Events", span: false },
      { src: "/images/max-smith-0HCCpeWzxnI-unsplash.jpg", alt: "Teaching", span: true },
      { src: "/images/nayan-gavli-BeQDYGrOo_g-unsplash.jpg", alt: "Youth", span: false },
  ];

  return (
    <section id="gallery" ref={sectionRef} className="py-20 sm:py-28 bg-primary-blue">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-montserrat font-bold text-white-text">
                    Moments at Vessel
                </h2>
                <p className="mt-6 text-xl text-light-text max-w-3xl mx-auto leading-relaxed">
                    Capturing the spirit and energy of our congregation.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {images.map((img, idx) => (
                    <div key={idx} className={`gallery-item relative rounded-xl overflow-hidden shadow-2xl group ${img.span ? 'md:col-span-2' : ''}`}>
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1D4ED8/FFFFFF?text=Image'; }}
                        />
                        <div className="absolute inset-0 bg-primary-blue/80 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <span className="text-white-text font-montserrat font-bold text-lg">{img.alt}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}
