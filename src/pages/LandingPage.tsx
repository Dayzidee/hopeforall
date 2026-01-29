import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import Gallery from "../components/landing/Gallery";
import Pastorate from "../components/landing/Pastorate";
import LeadershipPreview from "../components/landing/LeadershipPreview";
import Outreach from "../components/landing/Outreach";
import DonationPortal from "../components/landing/DonationPortal";
import Ministries from "../components/landing/Ministries";

export default function LandingPage() {
  return (
    <div className="bg-neutral-50 overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <div className="relative z-10 -mt-10 md:-mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-none">
        <div className="pointer-events-auto">
          <About />
        </div>
      </div>

      {/* Leadership Section */}
      <Pastorate />

      {/* Meet Our People Preview */}
      <LeadershipPreview />

      {/* Ministries Section */}
      <Ministries />

      {/* Community & Environmental Impact */}
      <Outreach />

      {/* Gallery Section */}
      <section className="py-24 bg-gradient-to-b from-neutral-50 to-white">
        <Gallery />
      </section>

      {/* Donation Portal */}
      <DonationPortal />

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-primary text-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-montserrat font-bold mb-8 text-white">
            Welcome Home
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-12 text-neutral-300">
            Join us this Sunday. Experience a community where you truly belong.
          </p>
          <div className="text-lg bg-white/10 backdrop-blur-md inline-block px-10 py-8 rounded-2xl border border-white/20">
            <p className="font-bold text-2xl mb-2 text-accent-gold">The Chosen Vessel Church</p>
            <p className="mb-2 text-neutral-300">4650 Campus Drive • Fort Worth, TX 76119</p>
            <div className="flex flex-col gap-2 mb-4 text-neutral-300">
              <p>Email: <a href="mailto:info@thechosenvessel.org" className="hover:text-white transition-colors">info@thechosenvessel.org</a></p>
              <p>Phone: <a href="tel:8174139849" className="hover:text-white transition-colors">(817) 413-9849</a></p>
            </div>
            <div className="flex items-center justify-center gap-4 text-white font-bold bg-white/10 py-2 px-4 rounded-lg mt-2">
              <span>9:00 AM</span>
              <span className="w-1.5 h-1.5 bg-accent-teal rounded-full"></span>
              <span>11:30 AM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
