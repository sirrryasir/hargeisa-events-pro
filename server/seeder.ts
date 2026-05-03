import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./src/models/user.model.js";
import { Venue } from "./src/models/venue.model.js";
import { Booking } from "./src/models/booking.model.js";
import Vendor from "./src/models/vendor.model.js";
import Payment from "./src/models/payment.model.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const users = [
  { name: "Admin User", email: "admin@example.com", password: "password123", role: "admin" },
  { name: "Ambassador Manager", email: "manager@example.com", password: "password123", role: "manager" },
  { name: "Mansoor Manager", email: "mansoor@example.com", password: "password123", role: "manager" },
  { name: "Royal Palace Manager", email: "royal@example.com", password: "password123", role: "manager" },
  { name: "Guryasamo Manager", email: "guryasamo@example.com", password: "password123", role: "manager" },
  { name: "Maedah Manager", email: "maedah@example.com", password: "password123", role: "manager" },
  { name: "Huda Ali Muhumed", email: "huda@example.com", password: "password123", role: "customer" },
  { name: "Muna Siciid aw Nuur", email: "muna@example.com", password: "password123", role: "customer" },
  { name: "Habi Ali Muhumed", email: "habi@example.com", password: "password123", role: "customer" },
  { name: "Golden Decor", email: "golden@example.com", password: "password123", role: "vendor" },
  { name: "Elite Catering", email: "elite@example.com", password: "password123", role: "vendor" },
  { name: "Hargeisa Sounds", email: "sounds@example.com", password: "password123", role: "vendor" },
  { name: "Somaliland Lens", email: "lens@example.com", password: "password123", role: "vendor" },
  { name: "Shield Security", email: "shield@example.com", password: "password123", role: "vendor" },
];

const venues = [
  {
    name: "Ambassador Hotel",
    type: "hotel",
    address: "26 June District, Hargeisa",
    capacity: 450,
    pricePerDay: 850,
    amenities: ["VIP Suite", "Large Parking", "High-End Catering", "AC", "Full Sound System", "Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
    ],
    contactPhone: "+252 63 4123456",
    description: "The most prestigious venue in Somaliland, known for hosting international delegates and grand weddings.",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
  },
  {
    name: "Mansoor Hotel",
    type: "hotel",
    address: "Jigjiga Yar, Hargeisa",
    capacity: 300,
    pricePerDay: 600,
    amenities: ["Grand Ballroom", "High-Tech Audio", "VIP Suite", "Catering Kitchen", "Valet Parking"],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80"
    ],
    contactPhone: "+252 63 4441111",
    description: "A classic choice with a perfect balance of traditional atmosphere and modern service.",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
  },
  {
    name: "Royal Palace Hall",
    type: "hall",
    address: "Ibrahim Koodbuur, Hargeisa",
    capacity: 600,
    pricePerDay: 1500,
    amenities: ["Massive Capacity", "State-of-the-art Stage", "Kitchen Facilities", "Separate Entrance", "Projectors"],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
    ],
    contactPhone: "+252 63 4455667",
    description: "A brand new, ultra-modern hall designed specifically for the largest events in the city.",
    imageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80"
  },
  {
    name: "Guryasamo Hall",
    type: "hall",
    address: "Masallaha Area, Hargeisa",
    capacity: 500,
    pricePerDay: 1200,
    amenities: ["Luxury Interior", "Bride's Room", "Catering Space", "Sound Isolation", "Ample Parking"],
    images: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
    ],
    contactPhone: "+252 63 4345678",
    description: "Exquisite interior design and premium service for high-society weddings.",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
  },
  {
    name: "Maedah Banquet",
    type: "hall",
    address: "Borama Road, Hargeisa",
    capacity: 250,
    pricePerDay: 700,
    amenities: ["Banquet Hall", "Garden Area", "Secure Parking", "Stage Lighting", "Generator Support"],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80"
    ],
    contactPhone: "+252 63 4234567",
    description: "Ideal for corporate banquets, engagement parties, and high-end dinners.",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
  },
  {
    name: "Damal Hotel",
    type: "hotel",
    address: "Main Road, Hargeisa",
    capacity: 200,
    pricePerDay: 550,
    amenities: ["Modern Hall", "Video Wall", "AC System", "Executive Lounge", "Cafeteria Access"],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80"
    ],
    contactPhone: "+252 63 4556677",
    description: "A professional environment perfect for business conferences and seminars.",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
  },
];

const vendors = [
  {
    name: "Golden Decor",
    type: "Decoration",
    rating: 4.9,
    projects: 156,
    status: "available",
    contactEmail: "golden@example.com",
    contactPhone: "+252 63 1111111",
    description: "Bespoke event styling and floral arrangements."
  },
  {
    name: "Elite Catering",
    type: "Catering",
    rating: 4.8,
    projects: 210,
    status: "busy",
    contactEmail: "elite@example.com",
    contactPhone: "+252 63 2222222",
    description: "Traditional Somali cuisine and international buffet options."
  },
  {
    name: "Hargeisa Sounds",
    type: "Sound System",
    rating: 4.7,
    projects: 340,
    status: "available",
    contactEmail: "sounds@example.com",
    contactPhone: "+252 63 3333333",
    description: "Professional audio engineering and concert-grade equipment."
  },
  {
    name: "Somaliland Lens",
    type: "Photography",
    rating: 5.0,
    projects: 120,
    status: "available",
    contactEmail: "lens@example.com",
    contactPhone: "+252 63 4444444",
    description: "Capturing your most precious moments in high definition."
  },
  {
    name: "Shield Security",
    type: "Security",
    rating: 4.6,
    projects: 88,
    status: "available",
    contactEmail: "shield@example.com",
    contactPhone: "+252 63 5555555",
    description: "Professional crowd control and VIP protection services."
  },
];

const importData = async () => {
  try {
    await connectDB();

    console.log("Cleaning database...");
    await User.deleteMany();
    await Venue.deleteMany();
    await Booking.deleteMany();
    await Vendor.deleteMany();
    await Payment.deleteMany();

    console.log("Seeding users...");
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);

    // Find managers
    const ambassadorMgr = createdUsers.find(u => u.name === "Ambassador Manager")!;
    const mansoorMgr = createdUsers.find(u => u.name === "Mansoor Manager")!;
    const royalMgr = createdUsers.find(u => u.name === "Royal Palace Manager")!;
    const guryasamoMgr = createdUsers.find(u => u.name === "Guryasamo Manager")!;
    const maedahMgr = createdUsers.find(u => u.name === "Maedah Manager")!;

    console.log("Seeding venues...");
    const venuesWithManagers = venues.map(v => {
      if (v.name === "Ambassador Hotel") return { ...v, manager: ambassadorMgr._id };
      if (v.name === "Mansoor Hotel") return { ...v, manager: mansoorMgr._id };
      if (v.name === "Royal Palace Hall") return { ...v, manager: royalMgr._id };
      if (v.name === "Guryasamo Hall") return { ...v, manager: guryasamoMgr._id };
      if (v.name === "Maedah Banquet") return { ...v, manager: maedahMgr._id };
      return v;
    });
    const createdVenues = await Venue.insertMany(venuesWithManagers);

    // Find vendors
    const goldenUser = createdUsers.find(u => u.name === "Golden Decor")!;
    const eliteUser = createdUsers.find(u => u.name === "Elite Catering")!;
    const soundUser = createdUsers.find(u => u.name === "Hargeisa Sounds")!;
    const lensUser = createdUsers.find(u => u.name === "Somaliland Lens")!;
    const shieldUser = createdUsers.find(u => u.name === "Shield Security")!;

    console.log("Seeding vendors...");
    const vendorsWithOwners = vendors.map(vendor => {
      let ownerId;
      if (vendor.name === "Golden Decor") ownerId = goldenUser._id;
      else if (vendor.name === "Elite Catering") ownerId = eliteUser._id;
      else if (vendor.name === "Hargeisa Sounds") ownerId = soundUser._id;
      else if (vendor.name === "Somaliland Lens") ownerId = lensUser._id;
      else if (vendor.name === "Shield Security") ownerId = shieldUser._id;
      else ownerId = goldenUser._id;
      return { ...vendor, owner: ownerId };
    });
    await Vendor.insertMany(vendorsWithOwners);

    // Find customer users
    const userHuda = createdUsers.find(u => u.name === "Huda Ali Muhumed")!;
    const userMuna = createdUsers.find(u => u.name === "Muna Siciid aw Nuur")!;
    const userHabi = createdUsers.find(u => u.name === "Habi Ali Muhumed")!;

    console.log("Seeding sample bookings & payments...");
    const vAmb = createdVenues.find(v => v.name === "Ambassador Hotel")!;
    const vMan = createdVenues.find(v => v.name === "Mansoor Hotel")!;
    const vRoy = createdVenues.find(v => v.name === "Royal Palace Hall")!;
    const vGur = createdVenues.find(v => v.name === "Guryasamo Hall")!;

    const createdBookings = await Booking.insertMany([
      {
        user: userHuda._id,
        venue: vAmb._id,
        clientName: "Huda Ali",
        clientPhone: "+252 63 5111222",
        eventType: "wedding",
        eventDate: "2026-05-15",
        guestCount: 400,
        status: "confirmed",
        notes: "Project Defense Wedding Mockup.",
      },
      {
        user: userMuna._id,
        venue: vMan._id,
        clientName: "Muna Siciid",
        clientPhone: "+252 63 5222333",
        eventType: "conference",
        eventDate: "2026-06-10",
        guestCount: 200,
        status: "pending",
        notes: "Gollis University Project Presentation.",
      },
      {
        user: userHabi._id,
        venue: vRoy._id,
        clientName: "Habi Ali",
        clientPhone: "+252 63 5333444",
        eventType: "corporate",
        eventDate: "2026-05-28",
        guestCount: 500,
        status: "confirmed",
        notes: "Group Project Gala Dinner.",
      },
      {
        user: userHuda._id,
        venue: vGur._id,
        clientName: "Huda Ali",
        clientPhone: "+252 63 5444555",
        eventType: "graduation",
        eventDate: "2026-07-02",
        guestCount: 350,
        status: "confirmed",
        notes: "Our Graduation Party!",
      },
      {
        user: userMuna._id,
        venue: vAmb._id,
        clientName: "Muna Siciid",
        clientPhone: "+252 63 5555666",
        eventType: "corporate",
        eventDate: "2026-08-15",
        guestCount: 300,
        status: "pending",
        notes: "System Testing Launch.",
      }
    ]);

    console.log("Seeding payments history...");
    await Payment.insertMany([
      {
        transactionId: "TRX-1001",
        bookingId: createdBookings[0]!._id,
        clientName: "Huda Ali",
        venueName: vAmb.name,
        amount: 850,
        type: "Full Payment",
        status: "paid",
        paymentDate: new Date("2026-04-20"),
      },
      {
        transactionId: "TRX-1002",
        bookingId: createdBookings[1]!._id,
        clientName: "Muna Siciid",
        venueName: vMan.name,
        amount: 300,
        type: "Deposit (50%)",
        status: "paid",
        paymentDate: new Date("2026-04-18"),
      },
      {
        transactionId: "TRX-1003",
        bookingId: createdBookings[2]!._id,
        clientName: "Habi Ali",
        venueName: vRoy.name,
        amount: 1500,
        type: "Full Payment",
        status: "paid",
        paymentDate: new Date("2026-04-25"),
      },
      {
        transactionId: "TRX-1004",
        bookingId: createdBookings[3]!._id,
        clientName: "Huda Ali",
        venueName: vGur.name,
        amount: 600,
        type: "Deposit (50%)",
        status: "paid",
        paymentDate: new Date("2026-04-22"),
      }
    ]);

    console.log("✅ Data Seeded Successfully with Rich Dataset!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Venue.deleteMany();
    await Booking.deleteMany();
    await Vendor.deleteMany();
    await Payment.deleteMany();

    console.log("🗑️ Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
