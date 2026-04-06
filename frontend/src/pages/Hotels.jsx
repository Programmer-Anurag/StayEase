import Navbar from "../components/Navbar.jsx";
import HotelCard from "../components/HotelCard.jsx";
import { getHotels } from "../services/api.js";
import { useEffect, useState } from "react";

function Hotels() {



    const [listing, setListing] = useState([]);



    useEffect(() => {
        
       const fetchData=async()=>{
        const response=await getHotels();
        // console.log(response.data);
        
        setListing(response.data)

       }
       fetchData();

    }, []);

    return (
        <>
            <Navbar />
            <HotelCard listing={listing} setListing={setListing} />
        </>
    )

}

export default Hotels;