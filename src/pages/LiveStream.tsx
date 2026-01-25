export default function LiveStream() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-montserrat font-bold text-primary-blue">Live Stream</h1>

      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative flex items-center justify-center group">
        {/* Placeholder for Video Player */}
        <div className="text-center text-white-text">
            <p className="text-2xl font-bold mb-4">Live Service Offline</p>
            <p>Next broadcast: Sunday at 9:00 AM</p>
        </div>

        {/* Simulating "Live" badge */}
        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
            OFFLINE
        </div>
      </div>

      <div className="bg-white-text p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold font-montserrat mb-4">Previous Sermons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <span className="text-gray-500 font-bold">Sermon Archive {i}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
