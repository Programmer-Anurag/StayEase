import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'
import { BaseUrl } from '../../services/api';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function NewForm() {
    const navigate = useNavigate();
    const [Listing, setListing] = useState({
        title: "", description: "", price: NaN, location: "", country: ""

    });
    const [file,setFile]=useState(null);
    const [loading,setLoading]=useState(false);


    const cloud_name=import.meta.env.VITE_CLOUD_NAME;
    const upload_preset=import.meta.env.VITE_UPLOAD_PRESET
    
    
    const token=localStorage.getItem("token");
    
    


    
    async function fileUpload(){
        const data=new FormData();

        data.append("file",file);
        data.append("cloud_name",cloud_name);
        data.append("upload_preset",upload_preset);

        const response=await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            {
                method:"POST",
                body:data,
            }
        )
        setLoading(false);
        const res=await response.json();
        // console.log(res);
        
        return res;



    }
    
    
    async function handleSubmit(e) {

      e.preventDefault();
      setLoading(true)

       const filedetails=await fileUpload();
      console.log(filedetails);
      
       
        const data = new FormData();
        

        data.append("description", Listing.description);
        data.append("title",Listing.title);
        data.append("price", Listing.price);
        data.append("location",Listing.location);
        data.append("country",Listing.country);
        data.append("image",JSON.stringify({
            url:filedetails.url,
            name:filedetails.display_name
        }));
   
    
        try {
            const response = await axios.post(`${BaseUrl}/listings/new`, data, {
                headers: {
                    "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
                }
            })

            const res=response.data;
            

           
           
            
            if (res.success) {
                toast.success(res.success)
            } else {
                toast.warning(res.error)
                if(res.error=="jwt expired"){
                    localStorage.removeItem("token");
                    navigate("/login")
                }

                
                
                
            }


            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            
            console.log(error.message);
            
            
            toast.warning("something went wrong")

        }

    }


    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">

                <h2 className="text-base/7 font-semibold text-gray-900">Create A new Listing</h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">
                            Title
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">

                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder=" Cozy Mountain Cabin"
                                    className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    onChange={(e) => {
                                        setListing({ ...Listing, title: e.target.value })
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                            description
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                className="block w-half rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                defaultValue={''}
                                onChange={(e) => {
                                    setListing({ ...Listing, description: e.target.value })
                                }}
                            />
                        </div>
                    </div>

                </div>





                <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                            Price
                        </label>
                        <div className="mt-2">
                            <input
                                id="price"
                                name="price"
                                type="text"
                                autoComplete="given-name"
                                className="block w-2/5 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={(e) => {
                                    setListing({ ...Listing, price: e.target.value })
                                }}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="Location" className="block text-sm/6 font-medium text-gray-900">
                            Location
                        </label>
                        <div className="mt-2">
                            <input
                                id="Location"
                                name="Location"
                                type="Location"

                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={(e) => {
                                    setListing({ ...Listing, location: e.target.value })
                                }}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                            Country
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="country"
                                name="country"
                                autoComplete="country-name"
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                onChange={(e) => {
                                    setListing({ ...Listing, country: e.target.value })
                                }}
                            >
                                <option>United States</option>
                                <option>India</option>
                                <option>Mexico</option>
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="image" className="block text-sm/6 font-medium text-gray-900">
                            Upload image
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-5 py-5">
                            <div className="text-center">
                                <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                                <input type="file" onChange={(e)=>{
                                    setFile(e.target.files[0]);
                                }} />
                                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                </div>



            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm/6 font-semibold text-gray-900">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {loading?"uploading...":"save"}
                </button>
            </div>
        </form>
    )
}
