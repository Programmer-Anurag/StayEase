import {jwtDecode} from "jwt-decode"

export function isTokenValid(token) {
    try {
        const decoded = jwtDecode(token);

        if (!decoded.exp) return false;

        return decoded.exp * 1000 > Date.now(); // convert to ms
    } catch (err) {
        console.log(err.message);
        
        return false;
    }


}