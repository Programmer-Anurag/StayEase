import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StarIcon, TrashIcon } from '@heroicons/react/20/solid'
import ReviewForm from './Form/ReviewForm'
import axios from 'axios'
import { BaseUrl, summarizeAIReviews } from '../services/api'
import { toast } from 'sonner'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function HotelView({ viewHotel }) {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState(viewHotel?.listing?.reviews || [])
  const [aiSummary, setAiSummary] = useState("")
  const [summarizing, setSummarizing] = useState(false)
  const [aiSummaryError, setAiSummaryError] = useState("")

  const handleSummarizeReviews = async () => {
    if (reviews.length === 0) return

    try {
      setSummarizing(true)
      setAiSummaryError("")
      setAiSummary("")
      const response = await summarizeAIReviews(reviews)
      if (response.data && response.data.success) {
        setAiSummary(response.data.summary)
        toast.success("Reviews summarized successfully!")
      } else {
        setAiSummaryError(response.data?.message || "Failed to summarize reviews")
      }
    } catch (error) {
      console.error(error)
      setAiSummaryError(error.response?.data?.message || error.message || "Failed to connect to AI server")
    } finally {
      setSummarizing(false)
    }
  }

  const listing = viewHotel?.listing || {}
  const owner = listing.owner || {}
  const userID = viewHotel?.userID || ""

  // Calculate average rating correctly from reviews array
  const hasReviews = reviews.length > 0
  const avgRating = hasReviews
    ? reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.length
    : null

  const handleRemoveListing = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BaseUrl}/listings/${listing._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success("Listing deleted successfully!")
      navigate("/listings")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete listing. Please try again.")
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${BaseUrl}/listings/${listing._id}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success("Review deleted successfully!")
      setReviews(prev => prev.filter(r => r._id !== reviewId))
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete review. Make sure you are the author.")
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="bg-slate-50/30 pb-24">
      {/* Hero Image Section */}
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display sm:text-4xl">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-amber-500" />
              <span className="text-slate-800 font-bold">
                {hasReviews ? avgRating.toFixed(1) : "New"}
              </span>
              {hasReviews && (
                <>
                  <span>•</span>
                  <span className="underline cursor-pointer">{reviews.length} reviews</span>
                </>
              )}
            </div>
            <span>•</span>
            <span>📍 {listing.location}, {listing.country}</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="overflow-hidden rounded-2xl shadow-md border border-slate-200/50 bg-slate-100 aspect-16/9 lg:aspect-21/9 max-h-[500px]">
          <img
            alt={listing.title}
            src={listing.image?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600"}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-10">
            {/* Host Section */}
            <div className="flex items-center justify-between pb-8 border-b border-slate-200/80">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  Hosted by {owner.username || "Local Host"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Superhost • 2 years hosting experience</p>
              </div>
              <img
                alt={owner.username}
                src={owner.avtar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                className="h-14 w-14 rounded-full object-cover border-2 border-indigo-100 ring-4 ring-white"
              />
            </div>

            {/* Description Card */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-display">About this stay</h3>
              <p className="text-base leading-relaxed text-slate-600 font-sans whitespace-pre-line">
                {listing.description || "No description available for this beautiful property."}
              </p>
            </div>

            {/* Owner Operations (Edit/Remove) */}
            {owner._id === userID && (
              <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200/80">
                <Link
                  to={`/listings/${listing._id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition-all duration-300"
                >
                  Edit Listing Details
                </Link>
                <button
                  onClick={handleRemoveListing}
                  className="inline-flex items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600 transition-all duration-300 cursor-pointer"
                >
                  Remove Listing
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatPrice(listing.price || 0)}
                  <span className="text-sm font-medium text-slate-500"> / night</span>
                </span>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                  <StarIcon className="h-4 w-4 text-amber-500" />
                  <span>{hasReviews ? avgRating.toFixed(1) : "New"}</span>
                </div>
              </div>

              {/* Mock Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 border border-slate-300/80 rounded-xl overflow-hidden">
                  <div className="p-3 border-r border-slate-300/80 bg-slate-50/50">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check-in</label>
                    <input type="date" className="w-full text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none p-0 mt-1" defaultValue="2026-06-01" />
                  </div>
                  <div className="p-3 bg-slate-50/50">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Check-out</label>
                    <input type="date" className="w-full text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none p-0 mt-1" defaultValue="2026-06-08" />
                  </div>
                </div>

                <div className="p-3 border border-slate-300/80 rounded-xl bg-slate-50/50">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Guests</label>
                  <select className="w-full text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none p-0 mt-1">
                    <option>1 guest</option>
                    <option defaultValue>2 guests</option>
                    <option>3 guests</option>
                    <option>4+ guests</option>
                  </select>
                </div>

                <button 
                  onClick={() => toast.success("Booking requests are simulated in this version.")}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-center text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-300 cursor-pointer"
                >
                  Reserve Now
                </button>
              </div>

              <div className="mt-6 text-center">
                <span className="text-xs text-slate-400">You won't be charged yet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-12 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <StarIcon className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                {hasReviews ? `${avgRating.toFixed(1)} • ${reviews.length} reviews` : "New Stay • No reviews yet"}
              </h2>
            </div>

            {hasReviews && (
              <button
                onClick={handleSummarizeReviews}
                disabled={summarizing}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 border border-indigo-100/80 px-4 py-2.5 text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {summarizing ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent"></div>
                    Summarizing Reviews...
                  </>
                ) : (
                  "✨ Summarize Reviews with Gemini AI"
                )}
              </button>
            )}
          </div>

          {/* AI Summary Display */}
          {summarizing && (
            <div className="mb-8 p-6 bg-indigo-50/20 border border-indigo-100/40 rounded-2xl animate-pulse space-y-3">
              <div className="h-4 bg-indigo-200/50 rounded w-1/4"></div>
              <div className="h-3 bg-indigo-100/50 rounded w-3/4"></div>
              <div className="h-3 bg-indigo-100/50 rounded w-2/3"></div>
            </div>
          )}

          {aiSummary && (
            <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50/50 to-indigo-50/10 border border-indigo-100/80 rounded-2xl shadow-xs">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold font-display text-sm mb-3">
                <span>✨</span>
                <span>Gemini AI Review Summary</span>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-sans">
                {aiSummary}
              </div>
            </div>
          )}

          {aiSummaryError && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
              ⚠️ {aiSummaryError}
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 p-8 rounded-2xl text-center text-slate-500">
              No reviews yet. Be the first to write a review!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => {
                const author = review.author || {}
                const isReviewAuthor = author._id === userID || author === userID

                return (
                  <div key={review._id} className="p-6 border border-slate-200/60 rounded-2xl bg-white shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={author.avtar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                            className="h-10 w-10 rounded-full object-cover"
                            alt={author.username}
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-none">{author.username || "Guest User"}</p>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">Guest</span>
                          </div>
                        </div>
                        
                        {/* Star Rating display */}
                        <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                          <StarIcon className="h-3.5 w-3.5 text-amber-500 mr-1" />
                          <span className="text-xs font-bold text-amber-700">{review.rating || 5}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                    </div>

                    {isReviewAuthor && (
                      <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          Delete review
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Add Review Form Box */}
          <div className="max-w-2xl mt-12">
            <ReviewForm
              listingId={listing._id}
              onReviewAdded={(newReview) => {
                setReviews(prev => [...prev, newReview])
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelView;