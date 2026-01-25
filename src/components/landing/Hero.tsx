import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Animations
    const tl = gsap.timeline();
    tl.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .fromTo(textRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
      .fromTo(btnRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");

    // Particle System
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 50 : 100;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-primary-blue overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
          <img
            src="https://placehold.co/1920x1080/1F2937/FFFFFF?text=Vessel+Church"
            alt="Church Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-primary-blue/70"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white-text">
        <h1 ref={titleRef} className="font-montserrat font-bold text-5xl md:text-7xl leading-tight">
          Welcome to <span className="text-accent-teal">Vessel</span>
        </h1>

        <p ref={textRef} className="max-w-4xl mx-auto mt-6 text-xl md:text-2xl text-light-text leading-relaxed">
          A place of worship, community, and growth. Join Bishop Marvin L Sapp in our mission to build a brighter future together.
        </p>

        <div ref={btnRef} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#donation"
            className="px-10 py-4 rounded-lg font-montserrat font-bold text-white-text bg-accent-teal hover:scale-105 transform transition-all duration-300 shadow-xl text-lg"
          >
            Join Service
          </a>
          <a
            href="#mission"
            className="px-10 py-4 rounded-lg font-montserrat font-bold text-accent-teal bg-transparent border-2 border-accent-teal hover:bg-accent-teal hover:text-white-text transition-all duration-300 text-lg"
          >
            Our Mission
          </a>
        </div>
      </div>
    </section>
  );
}
