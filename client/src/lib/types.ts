// ============================================================
// Hargeisa Events Pro — Core Types
// ============================================================

export type BookingStatus = "confirmed" | "pending" | "cancelled" | "rejected";

export type EventType =
  | "wedding"
  | "conference"
  | "birthday"
  | "corporate"
  | "other";

export interface Venue {
  _id: string;
  name: string;
  type: "hotel" | "hall";
  address: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  imageUrl?: string;
  contactPhone: string;
  description: string;
}

export interface Booking {
  _id: string;
  venue?: Venue;
  clientName: string;
  clientPhone: string;
  eventType: EventType;
  eventDate: string;
  guestCount: number;
  status: BookingStatus;
  notes: string;
  rating?: number;
  feedback?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalVenues: number;
  activeBookings: number;
  pendingRequests: number;
  estimatedRevenue: number;
}

export interface Payment {
  _id: string;
  transactionId: string;
  clientName: string;
  venueName: string;
  amount: number;
  type: string;
  status: "paid" | "pending" | "failed";
  paymentDate: string;
}
