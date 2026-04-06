import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import EditForm from "../components/Form/EditForm";
import Navbar from "../components/Navbar";
import { getHotelDetail } from "../services/api";

export default function EditListing() {
    const [viewHotel, setviewHotel] = useState(null);

    const { id } = useParams();








    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const resp = await getHotelDetail(id);
                console.log(resp.data);
                setviewHotel(resp.data);

            } catch (error) {
                console.log(error);
            }
        }
        fetchHotel();

    }, [id]);

    if (!viewHotel || !viewHotel.listing) {
        return <>
        <Navbar/>
        <p className="text-center mt-10">Loading hotel details...</p>
        </>;
    }



    return (
        <>

            <Navbar />
            <EditForm viewHotel={viewHotel} />
        </>
    )
}