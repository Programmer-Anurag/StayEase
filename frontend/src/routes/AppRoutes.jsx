import { BrowserRouter, Routes, Route } from "react-router-dom"
import Hotels from "../pages/Hotels"
import HotelDetails from "../pages/HotelDetails"
import Home from "../pages/Home"
import NewListing from "../pages/NewListing"
import Login from "../pages/Login"

import SignUp from "../pages/SignUp"
import EditListing from "../pages/EditListing"



export default function AppRoute() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/listings" element={<Hotels />} />
                <Route path="/" element={<Home />} />
                <Route path="/listings/:id" element={<HotelDetails />} />

                <Route path="/new" element={<NewListing />} />
                <Route path="/listings/:id/edit" element={<EditListing/>}></Route>


                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    )
}