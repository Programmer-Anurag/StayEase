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
        const activeToken = localStorage.getItem("token");
        const res = await axios.get(`${BaseUrl}/listings/${id}`, {
            headers: {
                "Authorization": `Bearer ${activeToken}`
            }
        });
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const seedHotels = async (clearExisting = false) => {
    try {
        const activeToken = localStorage.getItem("token");
        const res = await axios.post(`${BaseUrl}/listings/seed`, { clearExisting }, {
            headers: {
                "Authorization": `Bearer ${activeToken}`
            }
        });
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const generateAIDescription = async (title, location, keywords) => {
    try {
        const activeToken = localStorage.getItem("token");
        const res = await axios.post(`${BaseUrl}/ai/generate-description`, { title, location, keywords }, {
            headers: {
                "Authorization": `Bearer ${activeToken}`
            }
        });
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const summarizeAIReviews = async (reviews) => {
    try {
        const res = await axios.post(`${BaseUrl}/ai/summarize-reviews`, { reviews });
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}












