export type BookingStatus = "confirmed" | "pending" | "cancelled";
export type EventType = "wedding" | "conference" | "birthday" | "corporate" | "other";

export interface Venue {
  id: string;
  name: string;
  type: "hotel" | "hall";
  address: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  imageUrl: string;
  contactPhone: string;
  description: string;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  clientName: string;
  clientPhone: string;
  eventType: EventType;
  eventDate: string;
  guestCount: number;
  status: BookingStatus;
  notes: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  phone: string;
  description: string;
}
