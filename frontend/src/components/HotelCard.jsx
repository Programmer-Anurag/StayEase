import { Link } from "react-router-dom";
import  {motion} from "framer-motion"




function HotelCard({listing}) {
  
  
  return (
    <div className="size-full rounded-0 bg-radial-[at_25%_25%] from-white to-zinc-900 to-95%">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8  ">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">All Listing</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {listing.map((hotel) => (
             <motion.div
              key={hotel._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <img
                alt={hotel.description}
                src={hotel.image.url}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-900">

                    <Link to={`/listings/${hotel._id}`} >
                      <span aria-hidden="true" className="absolute inset-0" />
                      {hotel.title}
                    </Link>
                    
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">₹{hotel.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}


export default HotelCard;
