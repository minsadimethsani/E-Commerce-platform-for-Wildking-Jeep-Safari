import { Timestamp } from "firebase/firestore";

export type ParkType = "yala" | "udawalawe" | "wilpattu" | "minneriya";

export type TimeSlotType = 
  | "Dawn Patrol (5:30 AM)" 
  | "Dusk Safari (2:30 PM)" 
  | "Full-Day VIP (5:30 AM - 6:00 PM)";

export interface SafariPackageDoc {
  id: string;
  title: string;
  park: ParkType;
  parkName: string;
  tagline: string;
  duration: string;
  timeSlot: TimeSlotType;
  priceUsd: number;
  priceEur: number;
  priceLkr: number;
  rating: number;
  reviewsCount: number;
  sightingsRate: string;
  badge?: string;
  image: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  maxGuests: number;
  updatedAt?: Timestamp | string;
}

export interface VehicleSpecs {
  suspension: string;
  seating: string;
  viewingAngle: string;
  charging: string;
  amenities: string;
}

export interface JeepVehicleDoc {
  id: string;
  name: string;
  tagline: string;
  model: string;
  image: string;
  images?: string[];
  capacity: string;
  features: string[];
  specs: VehicleSpecs;
  updatedAt?: Timestamp | string;
}

export interface ParkDestinationDoc {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  gallery?: string[];
  primarySpecies: string[];
  bestSeason: string;
  keyFact: string;
  distanceFromColombo: string;
  updatedAt?: Timestamp | string;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  country?: string;
}

export interface PickupDetails {
  hotelName?: string;
  address?: string;
}

export interface BookingDoc {
  id?: string;
  packageId: string;
  packageTitle: string;
  park: string;
  expeditionDate: string;
  timeSlot: string;
  selectedVehicle?: string;
  guestCount: number;
  customerInfo: CustomerInfo;
  pickupDetails?: PickupDetails;
  totalAmountUsd: number;
  currency: "USD" | "EUR" | "LKR";
  specialRequests?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  userId?: string;
  createdAt: Timestamp | string;
  updatedAt?: Timestamp | string;
}

export interface InquiryDoc {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  preferredPark?: string;
  message: string;
  status: "new" | "in_progress" | "closed";
  createdAt: Timestamp | string;
}

export interface ReviewDoc {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  comment: string;
  sightingPhoto?: string;
  sightingTag?: string;
  packageBooked: string;
  avatar: string;
  createdAt?: Timestamp | string;
}

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "customer" | "admin" | "guide";
  phone?: string;
  createdAt: Timestamp | string;
  lastLoginAt?: Timestamp | string;
}

export interface GuideDoc {
  id: string;
  name: string;
  role: "master_tracker" | "driver";
  phone: string;
  languages: string[];
  rating: number;
  assignedPark: ParkType;
  availability: boolean;
}

export interface PromotionDoc {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  expiryDate: string;
  maxUses: number;
  timesUsed: number;
  isActive: boolean;
}
