import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { doc, onSnapshot } from 'firebase/firestore';
import { Video, Clock } from 'lucide-react';

export default function LiveStream() {
  const [activeTab, setActiveTab] = useState<'live' | 'archive'>('live');
  const [liveConfig, setLiveConfig] = useState<{ videoId: string; isLive: boolean } | null>(null);

  useEffect(() => {
    // Listen to live stream config
    // We'll assume a doc 'config/livestream' exists
    const unsub = onSnapshot(doc(db, "config", "livestream"), (doc) => {
      if (doc.exists()) {
        setLiveConfig(doc.data() as any);
      }
    });
    return () => unsub();
  }, []);

  const liveVideoId = liveConfig?.videoId || 'live_stream?channel=UCwRxGy0RvPbd9PLJlVQYhtg'; // Fallback to channel live
  const archiveListId = 'UUwRxGy0RvPbd9PLJlVQYhtg'; // Keeping hardcoded channel upload playlist for now or can be config

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
              /* Playlist Player */
              <iframe
                src={`https://www.youtube.com/embed/videoseries?list=${archiveListId}`}
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
              <div className="group flex gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
                <div className="w-24 h-16 bg-neutral-200 rounded-md overflow-hidden relative flex-shrink-0">
                  <img
                    src="https://source.unsplash.com/random/400x300?worship"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Series"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-800 line-clamp-1 group-hover:text-accent-teal transition-colors">The Power of Faith</h4>
                  <p className="text-xs text-neutral-500 mt-1">Pastor Marvin L. Sapp</p>
                </div>
              </div>
              <div className="group flex gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
                <div className="w-24 h-16 bg-neutral-200 rounded-md overflow-hidden relative flex-shrink-0">
                  <img
                    src="https://source.unsplash.com/random/400x300?bible"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Series"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-800 line-clamp-1 group-hover:text-accent-teal transition-colors">Kingdom Economics</h4>
                  <p className="text-xs text-neutral-500 mt-1">Financial Stewardship</p>
                </div>
              </div>
              <div className="group flex gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
                <div className="w-24 h-16 bg-neutral-200 rounded-md overflow-hidden relative flex-shrink-0">
                  <img
                    src="https://source.unsplash.com/random/400x300?church"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Series"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-800 line-clamp-1 group-hover:text-accent-teal transition-colors">Family Foundations</h4>
                  <p className="text-xs text-neutral-500 mt-1">Building Strong Homes</p>
                </div>
              </div>
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
