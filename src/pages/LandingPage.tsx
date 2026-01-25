import Hero from "../components/landing/Hero";
import Mission from "../components/landing/Mission";
import Gallery from "../components/landing/Gallery";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Mission />
      <Gallery />

      {/* Donation Section */}
      <section id="donation" className="py-20 sm:py-28 bg-white-text">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-montserrat font-bold text-primary-blue mb-8">
              Support Our Ministry
            </h2>
            <p className="text-xl text-dark-text max-w-3xl mx-auto mb-12">
              Your generosity helps us continue to spread the word and support our community.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
                <button className="px-8 py-4 bg-accent-teal text-white-text font-bold rounded-lg shadow-lg hover:scale-105 transition-transform">
                    Give Online
                </button>
            </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-28 bg-primary-blue text-white-text">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
             <h2 className="text-4xl sm:text-5xl font-montserrat font-bold mb-8">
              Join Us This Sunday
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-12">
               We would love to see you. Come as you are.
            </p>
            <div className="text-lg">
                <p>456 Hope Avenue, Unity District</p>
                <p>Service Times: 9:00 AM & 11:30 AM</p>
            </div>
        </div>
      </section>
    </div>
  );
}
