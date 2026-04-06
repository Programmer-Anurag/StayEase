import axios from "axios";

const token = localStorage.getItem("token");


export const BaseUrl = import.meta.env.VITE_API_URL;



export const getHotels = async () => {
    try {
        const res = await axios.get(`${BaseUrl}/listings`)
        
        
        return res;
      
        

    } catch (error) {
        console.log(error);

    }
}


export const getHotelDetail = async (id) => {
    try {
        const res = await axios.get(`${BaseUrl}/listings/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return res;
    } catch (error) {
        console.log(error);
    }
}












