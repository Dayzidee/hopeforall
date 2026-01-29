import { useState, useEffect } from 'react';
import { db, COLLECTIONS } from '../services/db';
import { doc, onSnapshot, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Video, Clock, PlayCircle } from 'lucide-react';

export default function LiveStream() {
  const [activeTab, setActiveTab] = useState<'live' | 'archive'>('live');
  const [liveConfig, setLiveConfig] = useState<{ videoId: string; isLive: boolean } | null>(null);
  const [featuredSeries, setFeaturedSeries] = useState<any[]>([]);
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null);

  useEffect(() => {
    // Listen to live stream config
    const unsub = onSnapshot(doc(db, "config", "livestream"), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as any;
        setLiveConfig(data);
        if (data.isLive) {
          setActiveTab('live');
        }
      }
    });

    // Fetch Featured Series (Recent Sermons)
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, COLLECTIONS.CONTENT),
          where('type', '==', 'sermon'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const series = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedSeries(series);
        if (series.length > 0) {
          setSelectedArchiveId(series[0].videoId);
        }
      } catch (error) {
        console.error("Error fetching featured series:", error);
      }
    };

    fetchFeatured();

    return () => unsub();
  }, []);

  const liveVideoId = liveConfig?.videoId || 'live_stream?channel=UCwRxGy0RvPbd9PLJlVQYhtg';
  const archiveListId = 'UUwRxGy0RvPbd9PLJlVQYhtg'; // Fallback playlist

  const handleSeriesClick = (videoId: string) => {
    setSelectedArchiveId(videoId);
    setActiveTab('archive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-primary-blue">The Chosen Vessel TV</h1>
          <p className="text-neutral-500 mt-1">Watch live services or catch up on past messages.</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-neutral-200">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'live' ? 'bg-red-600 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-50'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'live' && liveConfig?.isLive ? 'bg-white animate-pulse' : 'bg-red-800'}`} />
            Live Stream
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'archive' ? 'bg-primary-blue text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-50'}`}
          >
            <Video className="w-4 h-4" />
            Recent Messages
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Player Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 group">
            {activeTab === 'live' ? (
              <>
                {/* Live Player */}
                <iframe
                  src={`https://www.youtube.com/embed/${liveVideoId}`}
                  title="The Chosen Vessel Live Stream"
                  className="absolute top-0 left-0 w-full h-full z-10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </>
            ) : (
              /* Playlist Player or Selected Video */
              <iframe
                src={`https://www.youtube.com/embed/${selectedArchiveId ? selectedArchiveId : `videoseries?list=${archiveListId}`}`}
                title="Recent Sermons"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* Info Section */}
          {activeTab === 'live' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-teal/10 rounded-full flex items-center justify-center text-accent-teal flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-blue text-lg mb-2">Service Schedule</h3>
                  <p className="text-neutral-600 mb-4 leading-relaxed">
                    Our live stream is available during scheduled service times. If you see "Video Unavailable", it means we are currently offline. Join us at the times below!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-100 text-sm font-bold text-primary-blue">
                      <div className="w-2 h-2 rounded-full bg-accent-teal"></div>
                      Sundays 9:00 AM CST
                    </span>
                    <span className="inline-flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-100 text-sm font-bold text-primary-blue">
                      <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                      Sundays 11:30 AM CST
                    </span>
                    <span className="inline-flex items-center gap-2 bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-100 text-sm font-bold text-primary-blue">
                      <div className="w-2 h-2 rounded-full bg-accent-gold"></div>
                      Wednesdays 7:00 PM CST
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <h3 className="font-bold font-montserrat text-lg mb-4 text-primary-blue">Featured Series</h3>
            <div className="space-y-4">
              {featuredSeries.length > 0 ? (
                featuredSeries.map((series) => (
                  <div
                    key={series.id}
                    onClick={() => handleSeriesClick(series.videoId)}
                    className={`group flex gap-3 cursor-pointer p-2 rounded-lg transition-colors ${selectedArchiveId === series.videoId && activeTab === 'archive' ? 'bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-neutral-50'}`}
                  >
                    <div className="w-24 h-16 bg-neutral-800 rounded-md overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                      {/* Use YouTube Thumbnail if available or placeholder */}
                      <img
                        src={`https://img.youtube.com/vi/${series.videoId}/mqdefault.jpg`}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://source.unsplash.com/random/400x300?worship' }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        alt={series.title}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                        <PlayCircle className="text-white w-6 h-6 opacity-80 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm line-clamp-2 transition-colors ${selectedArchiveId === series.videoId && activeTab === 'archive' ? 'text-accent-teal' : 'text-neutral-800 group-hover:text-accent-teal'}`}>
                        {series.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">{series.author || 'The Chosen Vessel'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  <p>No featured series available yet.</p>
                  <p className="text-xs mt-1">Check back soon for updates!</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-blue to-primary-dark p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold font-montserrat text-lg mb-2">Need Prayer?</h3>
            <p className="text-blue-100 text-sm mb-4">Our prayer team is standing by to agree with you in prayer.</p>
            <button className="w-full py-3 bg-white text-primary-blue font-bold rounded-lg hover:bg-neutral-100 transition-colors shadow-md">
              Request Prayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
