import { PhotoIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { BaseUrl } from '../../services/api'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function EditForm({ viewHotel }) {
    const navigate = useNavigate()
    const [Listing, setListing] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        country: "",
    })
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const cloud_name = import.meta.env.VITE_CLOUD_NAME
    const upload_preset = import.meta.env.VITE_UPLOAD_PRESET
    const token = localStorage.getItem("token")

    // Initialize listing when viewHotel is loaded
    useEffect(() => {
        if (viewHotel?.listing) {
            setListing({
                title: viewHotel.listing.title || "",
                description: viewHotel.listing.description || "",
                price: viewHotel.listing.price || "",
                location: viewHotel.listing.location || "",
                country: viewHotel.listing.country || "",
            })
        }
    }, [viewHotel])

    // Early return if data not loaded
    if (!viewHotel) return <div>Loading...</div>

    async function fileUpload() {
        const data = new FormData()
        data.append("file", file)
        data.append("cloud_name", cloud_name)
        data.append("upload_preset", upload_preset)

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        )
        const res = await response.json()
        return res
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        try {
            let filedetails = {}
            if (file) {
                filedetails = await fileUpload()
            } else {
                filedetails.url = viewHotel.listing.image?.url
                filedetails.display_name = viewHotel.listing.image?.filename;
            }


            const payload = {
                listing: {
                    title: Listing.title,
                    description: Listing.description,
                    price: Number(Listing.price),
                    location: Listing.location,
                    country: Listing.country,
                    image: JSON.stringify({
                        url: filedetails.url,
                        name: filedetails.display_name
                    }),
                }
            };

            const response = await axios.put(
                `${BaseUrl}/listings/${viewHotel.listing._id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            console.log(response);
            

            toast.success("Listing updated successfully!")
            navigate(`/listings/${viewHotel.listing._id}`)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while updating")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">
                <h2 className="text-base/7 font-semibold text-gray-900">Edit your Listing</h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">Title</label>
                        <div className="mt-2">
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={Listing.title}
                                disabled={loading}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={(e) => setListing({ ...Listing, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">Description</label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                value={Listing.description}
                                rows={3}
                                disabled={loading}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={(e) => setListing({ ...Listing, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">Price</label>
                        <div className="mt-2">
                            <input
                                id="price"
                                name="price"
                                type="text"
                                value={Listing.price}
                                disabled={loading}
                                className="block w-2/5 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={(e) => setListing({ ...Listing, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="location" className="block text-sm/6 font-medium text-gray-900">Location</label>
                        <div className="mt-2">
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={Listing.location}
                                disabled={loading}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={(e) => setListing({ ...Listing, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">Country</label>
                        <div className="mt-2">
                            <select
                                id="country"
                                name="country"
                                value={Listing.country}
                                disabled={loading}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={(e) => setListing({ ...Listing, country: e.target.value })}
                            >
                                <option>United States</option>
                                <option>India</option>
                                <option>Mexico</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="image" className="block text-sm/6 font-medium text-gray-900">Upload Image</label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-5 py-5">
                            <div className="text-center">
                                <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                                <input type="file" disabled={loading} onChange={(e) => setFile(e.target.files[0])} />
                                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm/6 font-semibold text-gray-900" onClick={() => navigate(-1)}>Cancel</button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {loading ? "Uploading..." : "Update"}
                </button>
            </div>
        </form>
    )
}