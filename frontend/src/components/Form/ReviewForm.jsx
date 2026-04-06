import { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../services/api";
import { toast } from "sonner";

export default function ReviewForm({ listingId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const headers = token
                ? { Authorization: `Bearer ${token}` }
                : {};

            if (!comment.trim()) {
                return alert("Comment required");
            }
            const res = await axios.post(
                `${BaseUrl}/listings/${listingId}/reviews`,
                {
                    review: {
                        rating,
                        comment,
                    },
                },
                { headers }
            );

            const data=res.data;
             if(data.error){
                toast.warning(data.error)
            }
            else{ 

                toast.success(data.success);
                
            }

            // reset form
            setComment("");
            setRating(5);

            // parent ko update karne ke liye
            onReviewAdded(res.data);

        } catch (err) {
            console.log(err);
            alert("Error adding review");
        }
    };

    return (
        <div className="mt-10 w-full bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Write a Review</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full h-28 p-3 border rounded-lg"
                />

                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="px-3 py-2 border rounded-lg"
                >
                    <option value="1">1 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="5">5 ⭐</option>
                </select>

                <button
                    type="submit"
                    className="bg-indigo-500 text-white px-5 py-2 rounded-lg"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
}