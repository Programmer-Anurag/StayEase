import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/20/solid";

function HotelCard({ listing }) {
  // Framer Motion container configuration for staggered load
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-transparent py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Recommended Stays</h2>
            <p className="text-sm text-slate-500 mt-1">Discover unique local stays all around the world.</p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {listing.length} options available
          </span>
        </div>

        {listing.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200/60 rounded-3xl p-8">
            <span className="text-4xl mb-4">🔍</span>
            <h3 className="text-lg font-bold text-slate-800 font-display">No Listings Found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">We couldn't find any stays matching your filters. Try adjusting your search query.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {listing.map((hotel) => {
              // Calculate average rating
              const hotelReviews = hotel.reviews || [];
              const hasReviews = hotelReviews.length > 0;
              const avgRating = hasReviews
                ? hotelReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / hotelReviews.length
                : null;

              return (
                <motion.div
                  key={hotel._id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-3 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  {/* Listing Image */}
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100 group-hover:opacity-95 transition-opacity">
                    <img
                      alt={hotel.title}
                      src={hotel.image?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"}
                      className="h-full w-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Country Badge */}
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-lg bg-black/60 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-white">
                      📍 {hotel.country}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="flex flex-1 flex-col justify-between pt-4 pb-2 px-1">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-500 truncate">{hotel.location}</span>
                        {/* Rating Display */}
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs font-bold text-slate-700">
                            {hasReviews ? avgRating.toFixed(1) : "New"}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                        <Link to={`/listings/${hotel._id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {hotel.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">{hotel.description}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price</span>
                        <span className="text-base font-extrabold text-slate-900">
                          {formatPrice(hotel.price || 0)}
                          <span className="text-xs font-normal text-slate-500"> / night</span>
                        </span>
                      </div>
                      
                      <div className="rounded-lg bg-indigo-50 text-indigo-600 p-2 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HotelCard;
