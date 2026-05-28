import { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../services/api";
import { toast } from "sonner";
import { StarIcon } from "@heroicons/react/20/solid";

export default function ReviewForm({ listingId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in to write a review.");
            return;
        }

        if (!comment.trim()) {
            toast.warning("Please write a comment before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post(
                `${BaseUrl}/listings/${listingId}/reviews`,
                {
                    review: {
                        rating,
                        comment,
                    },
                },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    } 
                }
            );

            const data = res.data;
            if (data.error) {
                toast.error(data.error);
            } else { 
                toast.success(data.success || "Review added!");
                // Clear form
                setComment("");
                setRating(5);
                // Call parent callback with the actual newReview object
                if (onReviewAdded && data.newReview) {
                    onReviewAdded(data.newReview);
                }
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Error adding review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-8 w-full bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-display mb-1">Leave a Review</h3>
            <p className="text-xs text-slate-500 mb-6">Share your experience and thoughts about this stay with others.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Interactive Star Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-md hover:bg-slate-50 transition-colors focus:outline-hidden cursor-pointer"
                      >
                        <StarIcon
                          className={`h-8 w-8 transition-all duration-150 ${
                            (hoverRating || rating) >= star
                              ? "text-amber-400 scale-110"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-semibold text-slate-600 ml-2">
                      {rating === 5 ? "Excellent! ⭐⭐⭐⭐⭐" : 
                       rating === 4 ? "Very Good ⭐⭐⭐⭐" :
                       rating === 3 ? "Good ⭐⭐⭐" :
                       rating === 2 ? "Fair ⭐⭐" : "Poor ⭐"}
                    </span>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label htmlFor="comment" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your review</label>
                  <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you love? How was the host? Tell us about your stay..."
                      rows={4}
                      disabled={submitting}
                      className="w-full rounded-xl border border-slate-300/80 bg-slate-50/50 p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex justify-end">
                  <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                      {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
            </form>
        </div>
    );
}