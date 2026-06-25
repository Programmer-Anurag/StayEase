import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { Listing } from "../models/listing.js";
import { User } from "../models/user.js";
import { Review } from "../models/review.js";

// Load environment variables dynamically based on script path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Mock Guest Users for Reviews
const mockUsers = [
    { username: "travel_seeker", email: "seeker@stayease.com", password: "seeker123", avtar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
    { username: "heritage_lover", email: "heritage@stayease.com", password: "heritage123", avtar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
    { username: "mountain_trekker", email: "trekker@stayease.com", password: "trekker123", avtar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200" }
];

// Sample Reviews Pool based on listing type
const reviewsPool = {
    mountain: [
        { comment: "Absolutely breathtaking views of the valley. Wood cabins are super cozy and clean!", rating: 5 },
        { comment: "Perfect escape from the city heat. The service was excellent and food was delicious.", rating: 4 },
        { comment: "Lovely mountain trails nearby. Friendly staff and peaceful environment.", rating: 5 }
    ],
    heritage: [
        { comment: "A mesmerizing stay with royal vibes. The heritage architecture is stunningly preserved.", rating: 5 },
        { comment: "Excellent hospitality. Walking through the corridors felt like walking through history.", rating: 4 },
        { comment: "A beautiful property with wonderful stories. Highly recommend the guided tour.", rating: 5 }
    ],
    temple: [
        { comment: "So peaceful and close to the temple. Seeing the evening rituals was deeply spiritual.", rating: 5 },
        { comment: "Very clean, great vegetarian food, and extremely polite staff. Will visit again.", rating: 4 },
        { comment: "Perfect place for pilgrimage. Clean rooms and very close to the holy places.", rating: 5 }
    ]
};

// 24 Curated High-Quality Real Indian Stays (Fallback Data)
const staticFallbackStays = [
    // Varanasi (Temples & Ghats)
    {
        title: "BrijRama Palace - Heritage Boutique Hotel",
        description: "Built in 1812, BrijRama Palace is one of the oldest heritage landmarks on the Ganges. Located right on Darbhanga Ghat, this palace features exquisite stone carving, classical music performances, and panoramic views of the Ganga Aarti.",
        image: {
            url: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_brijrama_palace"
        },
        price: 18500,
        location: "Darbhanga Ghat, Varanasi, Uttar Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [83.0104, 25.3078] },
        type: "heritage"
    },
    {
        title: "Taj Nadesar Palace Varanasi",
        description: "Set amidst verdant gardens, mango orchards, and jasmine fields, Taj Nadesar Palace has hosted royalty and celebrities since 1835. Indulge in royal carriage rides, butler services, and absolute spiritual serenity.",
        image: {
            url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_nadesar_palace"
        },
        price: 24000,
        location: "Nadesar Palace Grounds, Varanasi, Uttar Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [82.9868, 25.3344] },
        type: "heritage"
    },
    {
        title: "Alka Guest House & Heritage Hotel",
        description: "Perched beautifully on the edge of Dashashwamedh Ghat, Alka Guest House offers direct access to the holy river, clean rooftop dining overlooking the morning rituals, and cozy traditional rooms.",
        image: {
            url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_alka_varanasi"
        },
        price: 4200,
        location: "Dashashwamedh Ghat, Varanasi, Uttar Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [83.0101, 25.3068] },
        type: "temple"
    },
    // Agra (Historic Taj)
    {
        title: "The Oberoi Amarvilas Agra",
        description: "Located just 600 meters from the Taj Mahal, every room at The Oberoi Amarvilas offers uninterrupted views of this ancient monument of love. Indulge in Mughal-inspired architecture, lush reflection pools, and world-class spas.",
        image: {
            url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_oberoi_amarvilas"
        },
        price: 28000,
        location: "Taj East Gate Road, Agra, Uttar Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [78.0583, 27.1685] },
        type: "heritage"
    },
    {
        title: "Taj Hotel & Convention Centre Agra",
        description: "A sleek modern luxury hotel located minutes from the Taj Mahal, featuring an iconic rooftop infinity pool that looks out directly to the monument, upscale fine dining, and stylish design suites.",
        image: {
            url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_taj_convention_agra"
        },
        price: 9500,
        location: "Taj East Gate Road, Tajganj, Agra, Uttar Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [78.0592, 27.1678] },
        type: "heritage"
    },
    {
        title: "Radisson Hotel Agra",
        description: "Conveniently situated in Tajganj, Radisson Hotel Agra boasts spacious family rooms, multiple multi-cuisine dining options, and a gorgeous outdoor pool overlooking the Agra skyline.",
        image: {
            url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_radisson_agra"
        },
        price: 5200,
        location: "Fatehabad Road, Tajganj, Agra, Uttar Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [78.0435, 27.1598] },
        type: "heritage"
    },
    // Jaipur (Historic Pink City)
    {
        title: "Rambagh Palace Jaipur",
        description: "Known as the 'Jewel of Jaipur', this former royal residence of the Maharaja of Jaipur showcases spectacular luxury, manicured gardens, indoor and outdoor pools, and elegant rooms adorned with royal history.",
        image: {
            url: "https://images.unsplash.com/photo-1585983224974-084a8e065e76?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_rambagh_jaipur"
        },
        price: 29500,
        location: "Bhawani Singh Road, Jaipur, Rajasthan",
        country: "India",
        coordinates: { type: "Point", coordinates: [75.8085, 26.8982] },
        type: "heritage"
    },
    {
        title: "Samode Haveli Jaipur",
        description: "A traditional mansion built 175 years ago, Samode Haveli retains its old-world charm with frescoed walls, historic courtyards, leaf-green lawns, and a spectacular hand-carved swimming pool.",
        image: {
            url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_samode_haveli"
        },
        price: 11000,
        location: "Gangapole, Jaipur, Rajasthan",
        country: "India",
        coordinates: { type: "Point", coordinates: [75.8324, 26.9389] },
        type: "heritage"
    },
    {
        title: "Umaid Bhawan - Heritage Style Hotel",
        description: "Run by a family of Rajput noblemen, Umaid Bhawan features intricately carved balconies, attractive courtyards, puppet shows, and rooftop dining, offering a true taste of Rajput hospitality.",
        image: {
            url: "https://images.unsplash.com/photo-1598977123418-45f04b61b49e?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_umaid_bhawan"
        },
        price: 3800,
        location: "Bani Park, Jaipur, Rajasthan",
        country: "India",
        coordinates: { type: "Point", coordinates: [75.7932, 26.9298] },
        type: "heritage"
    },
    // Amritsar (Golden Temple)
    {
        title: "Hyatt Regency Amritsar",
        description: "Located just a short drive from the Golden Temple, this luxury hotel offers modern aesthetic suites, an outdoor pool, premium wellness spa, and an exclusive shuttle to the historic sites.",
        image: {
            url: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_hyatt_amritsar"
        },
        price: 6500,
        location: "G.T. Road, Amritsar, Punjab",
        country: "India",
        coordinates: { type: "Point", coordinates: [74.9082, 31.6214] },
        type: "temple"
    },
    {
        title: "Welcomheritage Ranjit Svilas",
        description: "Experience farm-fresh Punjabi hospitality at this boutique heritage resort. Features local architecture, brick-exposed walls, traditional home-cooked Punjabi meals, and warm family hosting.",
        image: {
            url: "https://images.unsplash.com/photo-1508250525171-a7218799e9b5?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_ranjit_svilas"
        },
        price: 4900,
        location: "Grand Trunk Road, Amritsar, Punjab",
        country: "India",
        coordinates: { type: "Point", coordinates: [74.9214, 31.6322] },
        type: "heritage"
    },
    // Hampi (Historic Ruins)
    {
        title: "Evolve Back Kamalapura Palace Hampi",
        description: "Inspired by the royal ruins of the Vijayanagara Empire, this palace resort features majestic stone archways, historic vaulting, fortress walls, and private infinity plunge pools.",
        image: {
            url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_evolve_back_hampi"
        },
        price: 26000,
        location: "Kamalapura, Hampi, Karnataka",
        country: "India",
        coordinates: { type: "Point", coordinates: [76.4382, 15.3114] },
        type: "heritage"
    },
    {
        title: "Hampi’s Boulders Resort",
        description: "Situated on the banks of the Tungabhadra River, this nature resort is nestled directly between the gigantic granite boulders unique to Hampi, offering spectacular wilderness and organic cottages.",
        image: {
            url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_hampi_boulders"
        },
        price: 7800,
        location: "Narayanpet, Hampi, Karnataka",
        country: "India",
        coordinates: { type: "Point", coordinates: [76.4891, 15.3524] },
        type: "mountain"
    },
    // Madurai (Temple Town)
    {
        title: "Heritage Madurai",
        description: "Spread over 17 acres of luxury greenery, Heritage Madurai is a resort designed by iconic architect Geoffrey Bawa. Features vintage cottages, temple-tank swimming pools, and ancient banyan trees.",
        image: {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_heritage_madurai"
        },
        price: 8800,
        location: "Melakkal Road, Madurai, Tamil Nadu",
        country: "India",
        coordinates: { type: "Point", coordinates: [78.0825, 9.9284] },
        type: "temple"
    },
    // Manali (Mountains)
    {
        title: "The Span Resort & Spa Manali",
        description: "Located on the banks of the mighty Beas River, this resort offers unobstructed views of snow-capped Himalayan peaks, wooden log cottages, private riverside seating, and apple orchard paths.",
        image: {
            url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_span_manali"
        },
        price: 13500,
        location: "Kullu-Manali Highway, Manali, Himachal Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.1892, 32.1798] },
        type: "mountain"
    },
    {
        title: "Manu Allaya - The Resort Spa Manali",
        description: "Tucked inside manicured mountain slopes, Manu Allaya features luxurious wooden cottages with modern luxury bathrooms, glass wall views of the pine forests, and cozy fireplaces.",
        image: {
            url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_manu_allaya"
        },
        price: 7500,
        location: "Chadiyari, Manali, Himachal Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.2024, 32.2536] },
        type: "mountain"
    },
    {
        title: "Solang Valley Resort Manali",
        description: "Surrounded by snow-capped peaks, pine forests, and the Beas river, this resort is ideal for mountain lovers. Close to Solang Valley for paragliding, skiing, and trekking.",
        image: {
            url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_solang_resort"
        },
        price: 6800,
        location: "Solang Valley, Manali, Himachal Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.1582, 32.3168] },
        type: "mountain"
    },
    // Shimla (Mountains)
    {
        title: "Wildflower Hall - An Oberoi Resort Shimla",
        description: "Located 8,250 feet above sea level, Wildflower Hall is a sanctuary in the Himalayas. Experience wood-panelled libraries, an outdoor heated whirlpool overlooking mountains, and forest walks.",
        image: {
            url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_wildflower_shimla"
        },
        price: 27500,
        location: "Chharabra, Shimla, Himachal Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.2483, 31.1198] },
        type: "mountain"
    },
    {
        title: "The Oberoi Cecil Shimla",
        description: "A grand heritage hotel built during the British Raj. Retains its colonial charm with wood floors, crackling fireplaces, a stunning indoor pool, and views across the valley.",
        image: {
            url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_cecil_shimla"
        },
        price: 14000,
        location: "Chaura Maidan, Shimla, Himachal Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.1524, 31.1042] },
        type: "heritage"
    },
    {
        title: "Woodville Palace Resort Shimla",
        description: "A former summer residence of royalty, Woodville Palace is set in 4 acres of private pine forests, offering vintage royal suites, rose gardens, and old-world colonial luxury.",
        image: {
            url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_woodville_palace"
        },
        price: 5500,
        location: "Raj Bhavan Road, Shimla, Himachal Pradesh",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.1824, 31.0984] },
        type: "heritage"
    },
    // Munnar (Mountains / Tea Gardens)
    {
        title: "Windermere Estate Tea Garden Retreat",
        description: "A quiet boutique resort set on a 55-acre tea and cardamom estate. Features charming slate-roofed cottages, birdwatching tours, and panoramic views of the Munnar hills.",
        image: {
            url: "https://images.unsplash.com/photo-1563911302283-d2bc1d9e6e70?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_windermere_munnar"
        },
        price: 9800,
        location: "Bison Valley Road, Munnar, Kerala",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.0624, 10.0682] },
        type: "mountain"
    },
    {
        title: "Blanket Hotel & Spa Munnar",
        description: "A luxury honeymoon resort located directly opposite the beautiful Attukad Waterfall. Features modern green balconies, private spa treatments, and sunrise tea valley walks.",
        image: {
            url: "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_blanket_munnar"
        },
        price: 8900,
        location: "Attukad Waterfall Road, Munnar, Kerala",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.0392, 10.0524] },
        type: "mountain"
    },
    // Leh-Ladakh (High Altitude Mountains)
    {
        title: "The Grand Dragon Ladakh",
        description: "The first luxury hotel in Leh, featuring eco-friendly solar heating, stunning insulated glass windows with views of the Stok Kangri mountains, and delicious local Ladakhi cuisine.",
        image: {
            url: "https://images.unsplash.com/photo-1626082895617-2c6de3476af7?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_grand_dragon_leh"
        },
        price: 11500,
        location: "Old Road, Leh, Ladakh",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.5812, 34.1598] },
        type: "mountain"
    },
    {
        title: "Stok Palace Heritage Hotel Ladakh",
        description: "Live like Ladakhi royalty inside the historic Stok Palace, built in 1820. Features traditional earthen architectural rooms, ancient Buddhist frescoes, and stunning valley views.",
        image: {
            url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1200",
            filename: "stayease_stok_palace"
        },
        price: 16500,
        location: "Stok Village, Leh, Ladakh",
        country: "India",
        coordinates: { type: "Point", coordinates: [77.5852, 34.0722] },
        type: "heritage"
    }
];

// Target Seeding Locations (Historic, Temple, Mountains)
const targetLocations = [
    { query: "historical hotels near Taj Mahal Agra", locationName: "Agra" },
    { query: "heritage hotels near Kashi Vishwanath Varanasi", locationName: "Varanasi" },
    { query: "palace hotels in Jaipur Rajasthan", locationName: "Jaipur" },
    { query: "hotels near Golden Temple Amritsar", locationName: "Amritsar" },
    { query: "heritage resorts near ruins Hampi Karnataka", locationName: "Hampi" },
    { query: "luxury hotels near Meenakshi Temple Madurai", locationName: "Madurai" },
    { query: "mountain resorts in Manali Himachal", locationName: "Manali" },
    { query: "hill station resorts in Shimla mountains", locationName: "Shimla" },
    { query: "tea garden resorts in Munnar Kerala", locationName: "Munnar" },
    { query: "hotels near Dal Lake Srinagar Kashmir", locationName: "Srinagar" },
    { query: "mountain luxury hotels in Leh Ladakh", locationName: "Leh-Ladakh" }
];

async function findOrCreateDefaultOwner() {
    let owner = await User.findOne({ username: "StayEaseAdmin" });
    if (!owner) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("admin123", salt);
        owner = new User({
            username: "StayEaseAdmin",
            email: "admin@stayease.com",
            hash: hash,
            avtar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
        });
        await owner.save();
        console.log("Created default admin user (username: StayEaseAdmin, password: admin123)");
    }
    return owner._id;
}

async function seedMockUsers() {
    const userIds = [];
    for (const u of mockUsers) {
        let user = await User.findOne({ username: u.username });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(u.password, salt);
            user = new User({
                username: u.username,
                email: u.email,
                hash: hash,
                avtar: u.avtar
            });
            await user.save();
            console.log(`Created mock user: ${u.username}`);
        }
        userIds.push(user._id);
    }
    return userIds;
}

async function createReviewsForListing(listingType, userIds) {
    const pool = reviewsPool[listingType] || reviewsPool.heritage;
    const selected = [pool[0], pool[1]]; // Seed 2 reviews per hotel
    const reviewIds = [];

    for (let i = 0; i < selected.length; i++) {
        const authorId = userIds[i % userIds.length];
        const newReview = new Review({
            comment: selected[i].comment,
            rating: selected[i].rating,
            author: authorId,
            createdAt: new Date()
        });
        await newReview.save();
        reviewIds.push(newReview._id);
    }
    return reviewIds;
}

export async function seedRealHotelsData(clearExisting = false) {
    try {
        const apiKey = process.env.RAPIDAPI_KEY || process.env.GOOGLE_PLACES_API_KEY;
        const isRapidApi = process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== "YOUR_API_KEY" && process.env.RAPIDAPI_KEY.trim() !== "";
        const isGoogleApi = !isRapidApi && process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_API_KEY !== "YOUR_API_KEY" && process.env.GOOGLE_PLACES_API_KEY.trim() !== "";

        const ownerId = await findOrCreateDefaultOwner();
        const userIds = await seedMockUsers();

        if (clearExisting) {
            console.log("Clearing existing listings...");
            await Listing.deleteMany({});
            await Review.deleteMany({});
        }

        // 1. Live Fetch from RapidAPI (TripAdvisor16)
        if (isRapidApi) {
            console.log("RapidAPI Key detected. Fetching live hotel data from TripAdvisor16...");
            const liveListings = [];

            for (const loc of targetLocations) {
                console.log(`[RapidAPI] Fetching locationId for: "${loc.locationName}"...`);
                try {
                    const locUrl = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${encodeURIComponent(loc.locationName)}`;
                    const locRes = await fetch(locUrl, {
                        headers: {
                            "x-rapidapi-key": apiKey,
                            "x-rapidapi-host": "tripadvisor16.p.rapidapi.com"
                        }
                    });
                    const locData = await locRes.json();

                    let locationId = null;
                    if (locData.data && locData.data.length > 0) {
                        const firstItem = locData.data[0];
                        locationId = firstItem.locationId || firstItem.geoId || firstItem.location_id || firstItem.id || firstItem.dest_id;
                        if (!locationId) {
                            console.log(`[RapidAPI] Item found for ${loc.locationName} but location identifier keys (locationId, geoId, location_id, id, dest_id) are missing. Item:`, JSON.stringify(firstItem));
                        }
                    } else {
                        console.log(`[RapidAPI] No location data returned for ${loc.locationName}. Response:`, JSON.stringify(locData));
                    }

                    if (locationId) {
                        console.log(`[RapidAPI] Found locationId: ${locationId}. Fetching hotels...`);
                        const hotelsUrl = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?locationId=${locationId}&checkIn=2026-07-01&checkOut=2026-07-05`;
                        const hotelsRes = await fetch(hotelsUrl, {
                            headers: {
                                "x-rapidapi-key": apiKey,
                                "x-rapidapi-host": "tripadvisor16.p.rapidapi.com"
                            }
                        });
                        const hotelsData = await hotelsRes.json();
                        
                        if (!hotelsData.data) {
                            console.log(`[RapidAPI] No hotels data returned for locationId ${locationId}. Response:`, JSON.stringify(hotelsData));
                        } else {
                            const sampleData = Array.isArray(hotelsData.data) ? hotelsData.data : (hotelsData.data.hotelCard || hotelsData.data.search_results || []);
                            console.log(`[RapidAPI] Hotels found for locationId ${locationId}. Count: ${sampleData.length}. Sample data keys:`, sampleData.length > 0 ? Object.keys(sampleData[0]) : "none");
                        }

                        let hotelsList = [];
                        if (hotelsData.data) {
                            if (Array.isArray(hotelsData.data)) {
                                hotelsList = hotelsData.data;
                            } else if (Array.isArray(hotelsData.data.hotelCard)) {
                                hotelsList = hotelsData.data.hotelCard;
                            } else if (Array.isArray(hotelsData.data.search_results)) {
                                hotelsList = hotelsData.data.search_results;
                            }
                        }

                        if (hotelsList && hotelsList.length > 0) {
                            const topHotels = hotelsList.slice(0, 3); // 3 hotels per location to limit api cost

                            for (const hotel of topHotels) {
                                const title = hotel.title || hotel.name;
                                if (!title) continue;

                                const rawAddress = hotel.address || hotel.secondaryInfo || (hotel.location && hotel.location.address) || loc.locationName;
                                const rating = hotel.rating || hotel.bubbleRating || 4.5;
                                const price = hotel.price 
                                    ? (typeof hotel.price === 'object' ? (hotel.price.amount || 6500) : parseInt(hotel.price.toString().replace(/[^0-9]/g, '')) || 6500)
                                    : Math.floor(Math.random() * 9000) + 3500;
                                
                                let imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";
                                if (hotel.heroImage?.url) imageUrl = hotel.heroImage.url;
                                else if (hotel.thumbnail?.url) imageUrl = hotel.thumbnail.url;
                                else if (hotel.photo?.url) imageUrl = hotel.photo.url;

                                const country = "India";
                                const location = rawAddress.split(",").slice(-3, -1).join(",").trim() || loc.locationName;

                                const coordinates = [
                                    hotel.longitude || 78.0 + (Math.random() - 0.5) * 5, 
                                    hotel.latitude || 20.0 + (Math.random() - 0.5) * 5
                                ];

                                const listingType = loc.query.includes("mountain") || loc.query.includes("hill") ? "mountain" : (loc.query.includes("temple") ? "temple" : "heritage");
                                const reviewIds = await createReviewsForListing(listingType, userIds);

                                const description = `Welcome to ${title}, a beautiful stay located in the scenic region of ${location}, ${country}. With a guest rating of ${rating}★, this property provides exceptional service, fine dining, and excellent comfort, ideal for travelers wanting to explore local landmarks.`;

                                const exists = await Listing.findOne({ title });
                                if (!exists) {
                                    liveListings.push({
                                        title,
                                        description,
                                        image: { url: imageUrl, filename: `rapidapi_${hotel.hotelId || Math.random().toString(36).substr(2, 9)}` },
                                        price,
                                        location,
                                        country,
                                        coordinates: { type: "Point", coordinates },
                                        reviews: reviewIds,
                                        owner: ownerId
                                    });
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.error(`[RapidAPI] Error fetching for ${loc.locationName}:`, err.message);
                }
            }

            if (liveListings.length > 0) {
                await Listing.insertMany(liveListings);
                console.log(`Successfully seeded ${liveListings.length} live hotels from RapidAPI!`);
                return { source: "RapidAPI (TripAdvisor16)", count: liveListings.length, ownerId };
            }
        }

        // 2. Live Fetch from Google Places API
        if (isGoogleApi) {
            console.log("Google Places API Key detected. Fetching live hotel data...");
            const liveListings = [];

            for (const loc of targetLocations) {
                console.log(`Fetching 3 hotels for query: "${loc.query}"...`);
                try {
                    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(loc.query)}&key=${apiKey}`;
                    const res = await fetch(searchUrl);
                    const data = await res.json();

                    if (data.results && data.results.length > 0) {
                        const topResults = data.results.slice(0, 3);

                        for (const result of topResults) {
                            const addressParts = result.formatted_address.split(",");
                            const country = addressParts[addressParts.length - 1].trim();
                            const parsedLocation = addressParts.slice(-3, -1).join(",").trim() || loc.locationName;

                            let imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";
                            let imageFilename = "google_place_placeholder";

                            if (result.photos && result.photos.length > 0) {
                                const photoRef = result.photos[0].photo_reference;
                                imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photoRef}&key=${apiKey}`;
                                imageFilename = `google_place_${result.place_id}`;
                            }

                            const listingType = loc.query.includes("mountain") || loc.query.includes("hill") ? "mountain" : (loc.query.includes("temple") ? "temple" : "heritage");
                            const reviewIds = await createReviewsForListing(listingType, userIds);

                            const description = `Welcome to ${result.name}, a premium stay located in the heart of ${parsedLocation}, ${country}. Highly rated by guests at ${result.rating || '4.5'} stars, this property offers outstanding hospitality, local accessibility, and premium amenities, making it a perfect retreat for historical, spiritual, and sightseeing tours.`;

                            const coordinates = [
                                result.geometry?.location?.lng || 78.0, 
                                result.geometry?.location?.lat || 20.0
                            ];

                            const price = result.price_level 
                                ? (result.price_level * 5000) + 1500 
                                : Math.floor(Math.random() * 9000) + 3500;

                            const exists = await Listing.findOne({ title: result.name });
                            if (!exists) {
                                liveListings.push({
                                    title: result.name,
                                    description,
                                    image: { url: imageUrl, filename: imageFilename },
                                    price,
                                    location: parsedLocation,
                                    country: country,
                                    coordinates: { type: "Point", coordinates },
                                    reviews: reviewIds,
                                    owner: ownerId
                                });
                            }
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching for ${loc.locationName}:`, err.message);
                }
            }

            if (liveListings.length > 0) {
                await Listing.insertMany(liveListings);
                console.log(`Successfully seeded ${liveListings.length} live hotels from Google Places API!`);
                return { source: "Google Places API", count: liveListings.length, ownerId };
            }
        }

        // 3. Fallback Seeding (Curated Stays - Zero Cost)
        console.log("Using zero-cost static fallback engine...");
        const pendingInsertions = [];

        for (const stay of staticFallbackStays) {
            const exists = await Listing.findOne({ title: stay.title });
            if (!exists) {
                const reviewIds = await createReviewsForListing(stay.type, userIds);
                pendingInsertions.push({
                    title: stay.title,
                    description: stay.description,
                    image: stay.image,
                    price: stay.price,
                    location: stay.location,
                    country: stay.country,
                    coordinates: stay.coordinates,
                    reviews: reviewIds,
                    owner: ownerId
                });
            }
        }

        if (pendingInsertions.length > 0) {
            await Listing.insertMany(pendingInsertions);
            console.log(`Seeded ${pendingInsertions.length} curated Indian stays with authentic guest reviews!`);
            return { source: "Curated Indian Tourist Fallback Database", count: pendingInsertions.length, ownerId };
        } else {
            console.log("All curated stays already exist in the database.");
            return { source: "No new insertions", count: 0, ownerId };
        }

    } catch (error) {
        console.error("Seeding operation failed:", error);
        throw error;
    }
}

// Standalone execution wrapper
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    console.log("Running seed script standalone...");
    mongoose.connect(process.env.mongoDB_URL || "mongodb://localhost:27017/StayEase")
        .then(async () => {
            console.log("Database connected. Seeding...");
            const clearDB = process.argv.includes("--clear");
            const result = await seedRealHotelsData(clearDB);
            console.log("Seed result:", result);
            mongoose.disconnect();
            console.log("Seeding complete. Disconnected.");
        })
        .catch(err => {
            console.error("Database connection failed:", err);
            process.exit(1);
        });
}
