
import { Listing } from "../models/listing.js";
import jwt, { decode } from "jsonwebtoken";
import { seedRealHotelsData } from "../utils/seedRealHotels.js";


export const index = async (req, res) => {
    const allListings = await Listing.find({}).populate("reviews");
    res.send(allListings);
}




export const showListing = async (req, res) => {
    try {
        const { id } = req.params;



        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }



        const authHeader = req.headers.authorization;



        if (!authHeader || authHeader === "Bearer null") {
            return res.status(200).json({ listing, userID: "" });
        }


        const token = authHeader.split(" ")[1];



        let userID = "";

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            userID = payload.id;
        } catch (err) {
            if (err.message === "jwt expired") {
                return res.status(200).json({ listing, userID: "" });
            }
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(200).json({ listing, userID });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server error" });
    }
};



export const postListing = async (req, res) => {
    try {
        console.log(req.body);

        const { title, description, price, location, country } = req.body;

        const { url, name } = JSON.parse(req.body.image);

        const owner = req.user.id;





        const newListing = new Listing({
            title, description, price, location, country, image: {
                url: url,
                filename: name
            }
        });
        newListing.owner = owner;
        await newListing.save();

        return res.status(201).send({
            success: "your listing added"
        })





    }
    catch (err) {
        console.log(err.message);

        return res.status(500).send({ error: "unsucceffull" });
        // next(new expressError(404, err.message));
    }
}

export const updateListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Agar file upload ho (multer se)
        const { url, name } = JSON.parse(req.body.listing.image);

        // Update listing
        let listing = await Listing.findByIdAndUpdate(id, {
            ...req.body.listing, image: {
                url: url,
                filename: name
            }
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            listing
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while updating",
            error: error.message
        });
    }
}


export const deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    return res.status(200).json({ success: "Listing Deleted!" });
}

export const seedRealHotels = async (req, res) => {
    try {
        const { clearExisting } = req.body;
        const result = await seedRealHotelsData(clearExisting === true);
        return res.status(200).json({
            success: true,
            message: "Database seeded successfully with real hotel data",
            details: result
        });
    } catch (error) {
        console.error("Seeding controller error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to seed database with real hotels",
            error: error.message
        });
    }
}


