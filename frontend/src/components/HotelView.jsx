import { StarIcon } from '@heroicons/react/20/solid'
import ReviewForm from './Form/ReviewForm';
import { Link } from 'react-router-dom';




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function HotelView({ viewHotel }) {

  const reviews = viewHotel.listing.reviews;
  console.log(viewHotel);
  

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;





  // const token = localStorage.getItem("token");
  // console.log(token);


  // console.log(reviews);


  return (
    <div className="size-full rounded-0 bg-radial-[at_25%_25%] from-white to-zinc-900 to-95%">
      <div className="pt-6">
        {/* <nav aria-label="Breadcrumb">
          <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {listing.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                    {breadcrumb.name}
                  </a>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a href={listing.image.url} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {listing.title}
              </a>
            </li>
          </ol>
        </nav> */}

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
          <img
            alt={viewHotel.listing.image.filename}
            src={viewHotel.listing.image.url}
            className="w-40 h-56 lg:row-span-2 lg:aspect-5/5 lg:size-full rounded-lg object-cover "
          />
          {/* <img
            alt={viewHotel.listing.images[1].alt}
            src={viewHotel.listing.images[1].src}
            className="col-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden"
          />
          <img
            alt={viewHotel.listing.images[2].alt}
            src={viewHotel.listing.images[2].src}
            className="col-start-2 row-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden"
          />
          <img
            alt={viewHotel.listing.images[3].alt}
            src={viewHotel.listing.images[3].src}
            className="row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4"
          /> */}
        </div>

        {/* viewHotel.listing info */}
        <div className="mx-auto max-w-2xl px-4 pt-10  sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 ">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-600 sm:text-2xl">{viewHotel.listing.title} in {viewHotel.listing.location}, {viewHotel.listing.country}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">viewHotel.listing information</h2>
            <p className="text-3xl tracking-tight text-gray-900">₹{viewHotel.listing.price}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  {/* Stars */}
                  <div className="flex items-center bg-white/80 px-2 py-1 rounded-full shadow-sm backdrop-blur-sm">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          avgRating > rating
                            ? 'text-yellow-400'
                            : 'text-gray-300',
                          'size-5 transition-all duration-200 hover:scale-110'
                        )}
                      />
                    ))}
                  </div>

                  {/* Rating number */}
                  <span className="text-sm font-semibold text-gray-700">
                    {avgRating.toFixed(1)}
                  </span>

                  {/* Total reviews */}
                  <span className="text-sm text-gray-500">
                    ({reviews.length} reviews)
                  </span>
                </div>


                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.length} reviews
                </a>
              </div>
            </div>


          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{viewHotel.listing.description}</p>
              </div>
            </div>

            <div className="mt-10 border-t border-b ">
              <div className="mt-4 space-y-6 ">
                <span><img
                  alt=""
                  src={viewHotel.listing.owner.avtar}
                  className="mb-2 inline size-9 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10"

                /></span>

                <p className="inline  ml-4  text-bold text-gray-1000">hosted by {viewHotel.listing.owner.username}</p>

              </div>
            </div>



            <div className="mt-10 border rounded-xl">
              <h2 className="ml-2 text-sm  font-medium text-gray-900">Details</h2>

              <div className="mt-4 ml-5 space-y-6 ">
                <p className="text-sm text-gray-600">{viewHotel.listing.description}</p>
              </div>
            </div>

            {(viewHotel.listing.owner._id == viewHotel.userID) && <div className='mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-4 lg:px-8'>
              <Link to={`/listings/${viewHotel.listing._id}/edit`} className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                Edit Listing</Link>

              <button className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Remove Listing</button>
            </div>}

          </div>
        </div>

      </div>
      <div className="border-t mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8" >

        <div className="flex col-2 items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/90 px-4 py-2 mt-4 rounded-full shadow-md backdrop-blur-md">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={classNames(
                    avgRating > rating
                      ? 'text-yellow-400'
                      : 'text-gray-300',
                    'size-10 transition-all duration-200 hover:scale-110'
                  )}
                />
              ))}
            </div>
          </div>
          <p className="sr-only">{reviews.average} out of 5 stars</p>
          <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 ">
            {reviews.length} reviews
          </a>
        </div>
      </div>

      <div className="border-t mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">

        {/* Reviews List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {viewHotel.listing.reviews.map((review) => (
            <div key={review._id} className="p-4 border mt-4 rounded-xl shadow-sm bg-white">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={review.author?.avtar || "/default-avatar.png"}
                  className="size-9 rounded-full"
                />
                <p className="font-medium">{review.author?.username || "Anonymous"}</p>
              </div>

              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Review Form */}
        <ReviewForm
          listingId={viewHotel.listing._id}
          onReviewAdded={(newReview) => {
            viewHotel.listing.reviews.push(newReview);
          }}
        />

      </div>


    </div>
  )
}


export default HotelView;