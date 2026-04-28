// ============================================================
// Hargeisa Events Pro — Mock Data
// Realistic venue and booking data for the Hargeisa market.
// ============================================================

import type { Venue, Booking, DashboardStats } from "./types";

export const venues: Venue[] = [
  {
    _id: "v1",
    name: "Ambassador Hotel",
    type: "hotel",
    address: "26 June District, Hargeisa",
    capacity: 350,
    pricePerDay: 800,
    amenities: ["Parking", "Catering", "AC", "Sound System", "Wi-Fi"],
    imageUrl: "/venues/ambassador.jpg",
    contactPhone: "+252 63 4123456",
    description:
      "Premier hotel venue in the heart of Hargeisa. Ideal for large weddings and corporate conferences with full-service catering.",
  },
  {
    _id: "v2",
    name: "Mansoor Hotel",
    type: "hotel",
    address: "Jigjiga Yar, Hargeisa",
    capacity: 200,
    pricePerDay: 500,
    amenities: ["Parking", "Catering", "AC", "Stage"],
    imageUrl: "/venues/mansoor.jpg",
    contactPhone: "+252 63 4234567",
    description:
      "Elegant banquet hall with modern staging facilities. Perfect for mid-size celebrations and business gatherings.",
  },
  {
    _id: "v3",
    name: "Oriental Hall",
    type: "hall",
    address: "Sha'ab Area, Hargeisa",
    capacity: 500,
    pricePerDay: 1200,
    amenities: [
      "Parking",
      "Catering",
      "AC",
      "Sound System",
      "Stage",
      "Lighting",
    ],
    imageUrl: "/venues/oriental.jpg",
    contactPhone: "+252 63 4345678",
    description:
      "The largest event hall in Hargeisa. Features a grand stage, professional lighting, and capacity for 500 guests.",
  },
  {
    _id: "v4",
    name: "Rays Hotel",
    type: "hotel",
    address: "Koodbuur, Hargeisa",
    capacity: 150,
    pricePerDay: 400,
    amenities: ["Parking", "Catering", "AC", "Wi-Fi"],
    imageUrl: "/venues/rays.jpg",
    contactPhone: "+252 63 4456789",
    description:
      "Intimate venue ideal for birthday parties and small corporate events. Excellent catering service included.",
  },
  {
    _id: "v5",
    name: "Maansoor Convention Center",
    type: "hall",
    address: "Independence Road, Hargeisa",
    capacity: 400,
    pricePerDay: 950,
    amenities: [
      "Parking",
      "Catering",
      "AC",
      "Sound System",
      "Wi-Fi",
      "Projector",
    ],
    imageUrl: "/venues/maansoor-convention.jpg",
    contactPhone: "+252 63 4567890",
    description:
      "Modern convention center with full AV setup. Suited for conferences, workshops, and formal events.",
  },
  {
    _id: "v6",
    name: "Daallo Hall",
    type: "hall",
    address: "Ahmed Dhagah, Hargeisa",
    capacity: 250,
    pricePerDay: 600,
    amenities: ["Parking", "Catering", "AC", "Stage", "Sound System"],
    imageUrl: "/venues/daallo.jpg",
    contactPhone: "+252 63 4678901",
    description:
      "Versatile event space near the city center. Popular choice for engagement ceremonies and community events.",
  },
];

export const bookings: Booking[] = [
  {
    _id: "b1",
    venue: venues[0],
    clientName: "Amina Abdi",
    clientPhone: "+252 63 5111222",
    eventType: "wedding",
    eventDate: "2026-05-15",
    guestCount: 300,
    status: "confirmed",
    notes: "Traditional Somali wedding. Requires separate male/female sections.",
    createdAt: "2026-04-20",
  },
  {
    _id: "b2",
    venue: venues[2],
    clientName: "Mohamed Hassan",
    clientPhone: "+252 63 5222333",
    eventType: "conference",
    eventDate: "2026-05-08",
    guestCount: 200,
    status: "confirmed",
    notes: "Tech industry conference. Need projector and podium setup.",
    createdAt: "2026-04-18",
  },
  {
    _id: "b3",
    venue: venues[3],
    clientName: "Fadumo Yusuf",
    clientPhone: "+252 63 5333444",
    eventType: "birthday",
    eventDate: "2026-05-22",
    guestCount: 80,
    status: "pending",
    notes: "Children's birthday party. Need kids-friendly decorations.",
    createdAt: "2026-04-22",
  },
  {
    _id: "b4",
    venue: venues[4],
    clientName: "Ismail Omar",
    clientPhone: "+252 63 5444555",
    eventType: "corporate",
    eventDate: "2026-05-10",
    guestCount: 150,
    status: "confirmed",
    notes: "Annual company meeting. Full AV setup required.",
    createdAt: "2026-04-19",
  },
  {
    _id: "b5",
    venue: venues[1],
    clientName: "Khadija Ali",
    clientPhone: "+252 63 5555666",
    eventType: "wedding",
    eventDate: "2026-06-01",
    guestCount: 180,
    status: "pending",
    notes: "Engagement ceremony followed by dinner reception.",
    createdAt: "2026-04-24",
  },
  {
    _id: "b6",
    venue: venues[5],
    clientName: "Abdirahman Jama",
    clientPhone: "+252 63 5666777",
    eventType: "other",
    eventDate: "2026-05-18",
    guestCount: 120,
    status: "cancelled",
    notes: "Community fundraiser — cancelled due to scheduling conflict.",
    createdAt: "2026-04-15",
  },
];

export const dashboardStats: DashboardStats = {
  totalVenues: venues.length,
  activeBookings: bookings.filter((b) => b.status === "confirmed").length,
  pendingRequests: bookings.filter((b) => b.status === "pending").length,
  estimatedRevenue: bookings
    .filter((b) => b.status === "confirmed")
    .reduce((acc, b) => acc + (b.venue?.pricePerDay || 0), 0),
};
