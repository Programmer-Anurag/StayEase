import Navbar from "../components/Navbar.jsx";
import HotelCard from "../components/HotelCard.jsx";
import { getHotels, seedHotels } from "../services/api.js";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { id: 'all', name: 'All Homes', icon: '🏠' },
  { id: 'beach', name: 'Beachfront', icon: '🏖️' },
  { id: 'cabins', name: 'Cabins', icon: '🪵' },
  { id: 'trending', name: 'Trending', icon: '🔥' },
  { id: 'mansions', name: 'Mansions', icon: '🏰' },
  { id: 'pools', name: 'Amazing Pools', icon: '🏊' },
  { id: 'nature', name: 'Nature', icon: '🌲' },
];

function Hotels() {
    const [allListings, setAllListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [showDevPanel, setShowDevPanel] = useState(false);
    const [seedingResult, setSeedingResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchData = async () => {
      try {
        const response = await getHotels();
        setAllListings(response.data || []);
        setFilteredListings(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
       fetchData();
    }, []);

    const handleSeedDatabase = async (clearExisting = false) => {
        try {
            setSeeding(true);
            setErrorMsg('');
            setSeedingResult(null);
            const response = await seedHotels(clearExisting);
            if (response.data && response.data.success) {
                setSeedingResult(response.data.details);
                // Trigger reload
                const reloadRes = await getHotels();
                setAllListings(reloadRes.data || []);
                setFilteredListings(reloadRes.data || []);
            } else {
                setErrorMsg(response.data?.message || "Failed to seed database");
            }
        } catch (error) {
            console.error(error);
            setErrorMsg(error.response?.data?.error || error.message || "Failed to seed database");
        } finally {
            setSeeding(false);
        }
    };

    // Handle Category & Search changes
    useEffect(() => {
      let result = allListings;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => 
          item.title?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query) ||
          item.country?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
        );
      }

      // Filter by category (mock behavior since categories are UI-only)
      if (selectedCategory !== 'all') {
        // Just distribute listings deterministically across categories for UX mock
        result = result.filter((_, index) => {
          if (selectedCategory === 'beach') return index % 3 === 0;
          if (selectedCategory === 'cabins') return index % 3 === 1;
          if (selectedCategory === 'trending') return index % 2 === 0;
          if (selectedCategory === 'mansions') return index % 4 === 0;
          if (selectedCategory === 'pools') return index % 3 === 2;
          return index % 5 === 0;
        });
      }

      setFilteredListings(result);
    }, [searchQuery, selectedCategory, allListings]);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />
            
            {/* Search & Categories Hero */}
            <div className="bg-white border-b border-slate-200/60 py-6 shadow-xs">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Search Inputs */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="flex items-center bg-white border border-slate-200 rounded-full p-2 shadow-md shadow-slate-100 hover:shadow-lg hover:border-slate-300/80 transition-all duration-300">
                    <div className="flex-1 px-4 py-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Where to?</label>
                      <input 
                        type="text" 
                        placeholder="Search destinations, stays..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none mt-0.5"
                      />
                    </div>
                    <button className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Categories Slider */}
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 scroll-smooth">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center gap-2 border-b-2 pb-2 px-1 text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-200 hover:text-slate-900 ${
                        selectedCategory === cat.id 
                          ? 'border-indigo-600 text-indigo-600 scale-105' 
                          : 'border-transparent text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List Contents */}
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : allListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4 max-w-md mx-auto">
                <div className="text-6xl mb-6">🏔️</div>
                <h3 className="text-xl font-bold font-display text-slate-800">No Stays Found</h3>
                <p className="text-slate-500 text-sm mt-2 mb-8 leading-relaxed">
                  Your database seems to be empty. Populate it with real Indian temple, heritage, and mountain properties to get started!
                </p>
                <button 
                  onClick={() => handleSeedDatabase(true)} 
                  disabled={seeding}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {seeding ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Syncing Indian Stays...
                    </>
                  ) : (
                    "Seed Real Indian Stays"
                  )}
                </button>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4 max-w-md mx-auto">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold font-display text-slate-800">No matching search results</h3>
                <p className="text-slate-500 text-sm mt-1">Try tweaking your search keywords or category filters.</p>
              </div>
            ) : (
              <HotelCard listing={filteredListings} />
            )}

            {/* Floating Dev Seeding Panel */}
            <div className="fixed bottom-6 right-6 z-50">
              {!showDevPanel ? (
                <button 
                  onClick={() => setShowDevPanel(true)}
                  className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-xs text-white text-xs font-semibold py-2.5 px-4 rounded-full shadow-lg border border-slate-700/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  🛠️ Dev Tools
                </button>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 w-72 max-w-xs space-y-4 animate-in slide-in-from-bottom-5 duration-300">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">StayEase Dev Panel</span>
                    <button 
                      onClick={() => setShowDevPanel(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-relaxed">
                    Control the database state. Seeding pulls real stays (Varanasi, Agra, Jaipur, Manali, Leh, Munnar, etc.) using Google API or our zero-cost fallback database.
                  </p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleSeedDatabase(false)}
                      disabled={seeding}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold py-2 px-3 rounded-lg border border-indigo-100 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {seeding ? "Syncing..." : "Sync Real Stays (Append)"}
                    </button>
                    <button 
                      onClick={() => handleSeedDatabase(true)}
                      disabled={seeding}
                      className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold py-2 px-3 rounded-lg border border-amber-100 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {seeding ? "Re-building..." : "Clear & Re-seed Stays"}
                    </button>
                  </div>
                  {seedingResult && (
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-[10px] space-y-1">
                      <div className="font-semibold text-slate-700">Last Seeding Success:</div>
                      <div className="text-slate-500">Source: <span className="font-medium text-slate-600">{seedingResult.source}</span></div>
                      <div className="text-slate-500">Count: <span className="font-medium text-slate-600">{seedingResult.count} stays</span></div>
                    </div>
                  )}
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg p-2.5 text-[10px] font-medium">
                      {errorMsg}
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
    )
}

export default Hotels;