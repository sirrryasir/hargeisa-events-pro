import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js";
import { Venue } from "./src/models/venue.model.js";
import { Booking } from "./src/models/booking.model.js";
import Vendor from "./src/models/vendor.model.js";
import Payment from "./src/models/payment.model.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    name: "Hargeisa Manager",
    email: "manager@example.com",
    password: "password123",
    role: "manager",
  },
  {
    name: "Customer User",
    email: "customer@example.com",
    password: "password123",
    role: "customer",
  },
];

const venues = [
  {
    name: "Ambassador Hotel",
    type: "hotel",
    address: "26 June District, Hargeisa",
    capacity: 350,
    pricePerDay: 800,
    amenities: ["Parking", "Catering", "AC", "Sound System", "Wi-Fi"],
    contactPhone: "+252 63 4123456",
    description: "Premier hotel venue in the heart of Hargeisa.",
  },
  {
    name: "Mansoor Hotel",
    type: "hotel",
    address: "Jigjiga Yar, Hargeisa",
    capacity: 200,
    pricePerDay: 500,
    amenities: ["Parking", "Catering", "AC", "Stage"],
    contactPhone: "+252 63 4234567",
    description: "Elegant banquet hall with modern staging facilities.",
  },
  {
    name: "Oriental Hall",
    type: "hall",
    address: "Sha'ab Area, Hargeisa",
    capacity: 500,
    pricePerDay: 1200,
    amenities: ["Parking", "Catering", "AC", "Sound System", "Stage"],
    contactPhone: "+252 63 4345678",
    description: "The largest event hall in Hargeisa, ideal for grand weddings.",
  },
  {
    name: "Rays Hotel",
    type: "hotel",
    address: "Borama Road, Hargeisa",
    capacity: 150,
    pricePerDay: 400,
    amenities: ["Parking", "Catering", "AC"],
    contactPhone: "+252 63 4456789",
    description: "Cozy venue for small to medium corporate events.",
  },
];

const vendors = [
  {
    name: "Golden Decor",
    type: "Decoration",
    rating: 4.8,
    projects: 120,
    status: "available",
    contactEmail: "golden@example.com",
    contactPhone: "+252 63 1111111",
  },
  {
    name: "Elite Catering",
    type: "Catering",
    rating: 4.9,
    projects: 85,
    status: "busy",
    contactEmail: "elite@example.com",
    contactPhone: "+252 63 2222222",
  },
  {
    name: "Hargeisa Sounds",
    type: "Sound System",
    rating: 4.5,
    projects: 200,
    status: "available",
    contactEmail: "sounds@example.com",
    contactPhone: "+252 63 3333333",
  },
  {
    name: "Somaliland Lens",
    type: "Photography",
    rating: 5.0,
    projects: 45,
    status: "available",
    contactEmail: "lens@example.com",
    contactPhone: "+252 63 4444444",
  },
];

const importData = async () => {
  try {
    await connectDB();

    // 1. Clear existing data
    console.log("Cleaning database...");
    await User.deleteMany();
    await Venue.deleteMany();
    await Booking.deleteMany();
    await Vendor.deleteMany();
    await Payment.deleteMany();

    // 2. Import Users
    console.log("Seeding users...");
    const createdUsers = await User.insertMany(users);

    // 3. Import Venues
    console.log("Seeding venues...");
    const createdVenues = await Venue.insertMany(venues);

    // 4. Import Vendors
    console.log("Seeding vendors...");
    await Vendor.insertMany(vendors);

    // 5. Import Sample Bookings & Payments
    console.log("Seeding sample bookings & payments...");
    if (createdVenues.length >= 2) {
      const v1 = createdVenues[0]!;
      const v2 = createdVenues[1]!;
      const createdBookings = await Booking.insertMany([
        {
          venue: v1._id,
          clientName: "Amina Abdi",
          clientPhone: "+252 63 5111222",
          eventType: "wedding",
          eventDate: "2026-05-15",
          guestCount: 300,
          status: "confirmed",
          notes: "Requires separate male/female sections.",
        },
        {
          venue: v2._id,
          clientName: "Mohamed Hassan",
          clientPhone: "+252 63 5222333",
          eventType: "conference",
          eventDate: "2026-06-10",
          guestCount: 150,
          status: "pending",
          notes: "Projector and mics needed.",
        },
      ]);

      console.log("Seeding payments...");
      await Payment.insertMany([
        {
          transactionId: "TRX-4592",
          bookingId: createdBookings[0]!._id,
          clientName: "Amina Abdi",
          venueName: v1.name,
          amount: 800,
          type: "Full Payment",
          status: "paid",
          paymentDate: new Date("2026-04-20"),
        },
        {
          transactionId: "TRX-4593",
          bookingId: createdBookings[1]!._id,
          clientName: "Mohamed Hassan",
          venueName: v2.name,
          amount: 600,
          type: "Deposit (50%)",
          status: "paid",
          paymentDate: new Date("2026-04-18"),
        }
      ]);
    }

    console.log("✅ Data Seeded Successfully!");
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
