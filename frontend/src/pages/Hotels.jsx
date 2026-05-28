import Navbar from "../components/Navbar.jsx";
import HotelCard from "../components/HotelCard.jsx";
import { getHotels } from "../services/api.js";
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

    useEffect(() => {
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
       fetchData();
    }, []);

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
            ) : (
              <HotelCard listing={filteredListings} />
            )}
        </div>
    )
}

export default Hotels;