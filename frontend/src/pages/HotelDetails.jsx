import { useState, useEffect } from "react";
import HotelView from "../components/HotelView";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { getHotelDetail } from "../services/api";




function HotelDetails() {

    const [viewHotel, setviewHotel] = useState(null);

    const {id} = useParams();


   

    



    useEffect(() => {
         const fetchHotel= async()=>{
            try {
                const resp = await getHotelDetail(id);   
            console.log(resp.data);  
            setviewHotel(resp.data);
                
            } catch (error) {
                console.log(error);   
            }
        }
        fetchHotel();
        
    },[id]);

    return (
        <>
            <Navbar />
            {viewHotel && <HotelView viewHotel={viewHotel} />}
        </>
    )


}

export default HotelDetails;