import { PhotoIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useState, useEffect } from 'react'
import { BaseUrl, generateAIDescription } from '../../services/api'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function EditForm({ viewHotel }) {
    const navigate = useNavigate()
    const [listingData, setListingData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        country: "India",
    })
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [aiKeywords, setAiKeywords] = useState("")
    const [aiGenerating, setAiGenerating] = useState(false)

    async function handleGenerateDescription() {
        if (!listingData.title || !listingData.location) {
            toast.warning("Please enter a Title and Location first to help Gemini write a matching description.")
            return
        }
        if (!aiKeywords.trim()) {
            toast.warning("Please provide some highlights/keywords (e.g. pool, balcony, luxury).")
            return
        }

        setAiGenerating(true)
        try {
            const response = await generateAIDescription(listingData.title, listingData.location, aiKeywords)
            if (response.data && response.data.success) {
                setListingData(prev => ({ ...prev, description: response.data.text }))
                toast.success("AI Description generated successfully!")
            } else {
                toast.error(response.data?.message || "Failed to generate AI description.")
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || error.message || "Failed to connect to AI server.")
        } finally {
            setAiGenerating(false)
        }
    }

    const cloud_name = import.meta.env.VITE_CLOUD_NAME
    const upload_preset = import.meta.env.VITE_UPLOAD_PRESET
    const token = localStorage.getItem("token")

    // Initialize listing when viewHotel is loaded
    useEffect(() => {
        if (viewHotel?.listing) {
            setListingData({
                title: viewHotel.listing.title || "",
                description: viewHotel.listing.description || "",
                price: viewHotel.listing.price || "",
                location: viewHotel.listing.location || "",
                country: viewHotel.listing.country || "India",
            })
        }
    }, [viewHotel])

    // Early return if data not loaded
    if (!viewHotel) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    async function fileUpload() {
        if (!file) return null
        
        const data = new FormData()
        data.append("file", file)
        data.append("cloud_name", cloud_name)
        data.append("upload_preset", upload_preset)

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                {
                    method: "POST",
                    body: data,
                }
            )
            if (!response.ok) {
                throw new Error("Failed to upload image")
            }
            return await response.json()
        } catch (error) {
            console.error("Cloudinary upload error:", error)
            throw error
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!token) {
            toast.error("You must be logged in to update a listing.")
            navigate("/login")
            return
        }

        if (!listingData.title || !listingData.description || !listingData.price || !listingData.location) {
            toast.warning("All text fields are required.")
            return
        }

        setLoading(true)

        try {
            let filedetails = {}
            if (file) {
                const uploaded = await fileUpload()
                filedetails.url = uploaded?.secure_url || uploaded?.url
                filedetails.display_name = uploaded?.original_filename || uploaded?.display_name || "listing"
            } else {
                filedetails.url = viewHotel.listing.image?.url
                filedetails.display_name = viewHotel.listing.image?.filename
            }

            const payload = {
                listing: {
                    title: listingData.title,
                    description: listingData.description,
                    price: Number(listingData.price),
                    location: listingData.location,
                    country: listingData.country,
                    image: JSON.stringify({
                        url: filedetails.url,
                        name: filedetails.display_name
                    }),
                }
            }

            await axios.put(
                `${BaseUrl}/listings/${viewHotel.listing._id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success("Listing updated successfully!")
            navigate(`/listings/${viewHotel.listing._id}`)
        } catch (error) {
            console.error("Update error:", error)
            toast.error(error.response?.data?.message || "Something went wrong while updating.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-6 py-12">
            <div className="bg-white rounded-3xl border border-slate-200/60 p-8 shadow-xl shadow-slate-100/50">
                <div className="border-b border-slate-100 pb-5 mb-8">
                    <h2 className="text-2xl font-bold font-display text-slate-900">Edit your Listing</h2>
                    <p className="text-sm text-slate-500 mt-1">Make updates to your listing details and cover photos.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Cozy Cabin in the Woods"
                            value={listingData.title}
                            disabled={loading}
                            onChange={(e) => setListingData({ ...listingData, title: e.target.value })}
                            className="block w-full rounded-xl border border-slate-300/80 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Description
                            </label>
                            
                            {/* AI Description Assistant */}
                            <div className="flex items-center gap-1.5 bg-indigo-50/75 border border-indigo-100/80 rounded-lg p-1">
                                <input 
                                    type="text" 
                                    placeholder="Keywords: pool, views, cozy" 
                                    value={aiKeywords}
                                    onChange={(e) => setAiKeywords(e.target.value)}
                                    disabled={loading || aiGenerating}
                                    className="bg-transparent border-none text-[11px] text-slate-700 placeholder-slate-400 focus:outline-hidden w-40 p-1"
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={loading || aiGenerating}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-1 px-2.5 rounded-md shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
                                >
                                    {aiGenerating ? "Generating..." : "✨ AI Generate"}
                                </button>
                            </div>
                        </div>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            placeholder="Provide a detailed description of the space, amenities, and local area..."
                            value={listingData.description}
                            disabled={loading}
                            onChange={(e) => setListingData({ ...listingData, description: e.target.value })}
                            className="block w-full rounded-xl border border-slate-300/80 bg-slate-50/50 p-4 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed"
                        />
                    </div>

                    {/* Price and Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Price per Night (₹)
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                placeholder="e.g. 4500"
                                value={listingData.price}
                                disabled={loading}
                                onChange={(e) => setListingData({ ...listingData, price: e.target.value })}
                                className="block w-full rounded-xl border border-slate-300/80 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Location (City)
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="e.g. Manali, Himachal Pradesh"
                                value={listingData.location}
                                disabled={loading}
                                onChange={(e) => setListingData({ ...listingData, location: e.target.value })}
                                className="block w-full rounded-xl border border-slate-300/80 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Country Selector */}
                    <div>
                        <label htmlFor="country" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Country
                        </label>
                        <div className="relative">
                            <select
                                id="country"
                                name="country"
                                value={listingData.country}
                                disabled={loading}
                                onChange={(e) => setListingData({ ...listingData, country: e.target.value })}
                                className="block w-full appearance-none rounded-xl border border-slate-300/80 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
                            >
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Japan">Japan</option>
                                <option value="France">France</option>
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-5 text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Image Preview & Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Listing Cover Image
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center mb-3">
                            {viewHotel.listing.image?.url && !file && (
                                <div className="relative w-full sm:w-40 aspect-video sm:aspect-square overflow-hidden rounded-xl border border-slate-200">
                                    <img 
                                        src={viewHotel.listing.image.url} 
                                        alt="Current cover" 
                                        className="h-full w-full object-cover"
                                    />
                                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 text-[9px] font-bold text-white uppercase rounded-md">Current</span>
                                </div>
                            )}
                            {file && (
                                <div className="relative w-full sm:w-40 aspect-video sm:aspect-square overflow-hidden rounded-xl border border-indigo-200">
                                    <img 
                                        src={URL.createObjectURL(file)} 
                                        alt="New selection" 
                                        className="h-full w-full object-cover"
                                    />
                                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-indigo-600 text-[9px] font-bold text-white uppercase rounded-md">New</span>
                                </div>
                            )}
                            
                            <div className="flex-1 w-full flex justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400 transition-colors px-6 py-6">
                                <div className="text-center flex flex-col items-center">
                                    <PhotoIcon aria-hidden="true" className="size-8 text-slate-300 mb-2" />
                                    <div className="flex text-sm text-slate-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-hidden hover:text-indigo-500"
                                        >
                                            <span>Upload a new file</span>
                                            <input 
                                                id="file-upload" 
                                                name="file-upload" 
                                                type="file" 
                                                disabled={loading}
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) setFile(e.target.files[0])
                                                }}
                                                className="sr-only" 
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-slate-100 mt-8">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            disabled={loading}
                            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 hover:text-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Updating..." : "Update Listing"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}