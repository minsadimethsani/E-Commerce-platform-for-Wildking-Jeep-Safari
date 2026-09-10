"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated, getAdminSession } from "@/lib/admin-auth";
import {
  getPackagesFromFirestore,
  getFleetFromFirestore,
  getReviewsFromFirestore,
  getDestinationsFromFirestore,
  seedFirestoreDatabase,
} from "@/lib/firestore-service";
import { BookingDoc, InquiryDoc, SafariPackageDoc, JeepVehicleDoc, ReviewDoc, ParkDestinationDoc } from "@/lib/types/firestore";

import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import OverviewStats from "@/components/admin/OverviewStats";
import BookingsManager from "@/components/admin/BookingsManager";
import InquiriesManager from "@/components/admin/InquiriesManager";
import PackagesManager from "@/components/admin/PackagesManager";
import ParksManager from "@/components/admin/ParksManager";
import FleetManager from "@/components/admin/FleetManager";
import ReviewsManager from "@/components/admin/ReviewsManager";

const MOCK_BOOKINGS: BookingDoc[] = [
  {
    id: "WK-BK-101",
    packageId: "yala-leopard-vip",
    packageTitle: "Yala Block 1 Exclusive Leopard & Bear Expedition",
    park: "yala",
    expeditionDate: "2026-09-05",
    timeSlot: "Dawn Patrol (5:30 AM)",
    guestCount: 4,
    customerInfo: {
      fullName: "Marcus Vance",
      email: "marcus.vance@zurich.ch",
      phone: "+41 79 123 4567",
      country: "Switzerland",
    },
    pickupDetails: {
      hotelName: "Cinnamon Wild Yala",
    },
    totalAmountUsd: 380,
    currency: "USD",
    specialRequests: "High-zoom binoculars requested for wildlife photography",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
  },
  {
    id: "WK-BK-102",
    packageId: "udawalawe-giant-elephants",
    packageTitle: "Udawalawe Elephant Sanctuary & Lake Sunset",
    park: "udawalawe",
    expeditionDate: "2026-09-08",
    timeSlot: "Dusk Safari (2:30 PM)",
    guestCount: 2,
    customerInfo: {
      fullName: "Elena Rostova",
      email: "elena.r@gmail.com",
      phone: "+44 7700 900077",
      country: "United Kingdom",
    },
    pickupDetails: {
      hotelName: "Kalu's Hideaway Udawalawe",
    },
    totalAmountUsd: 150,
    currency: "USD",
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
  },
];

const MOCK_INQUIRIES: InquiryDoc[] = [
  {
    id: "INQ-201",
    name: "Dr. Alistair Finch",
    email: "a.finch@oxford.ac.uk",
    phone: "+44 20 7946 0912",
    preferredPark: "Wilpattu National Park",
    message: "Interested in a 2-day private photography expedition for leopard tracking in Wilpattu. Do you provide gimbal camera mounts?",
    status: "new",
    createdAt: new Date().toISOString(),
  },
  {
    id: "INQ-202",
    name: "Sarah Tanaka",
    email: "sarah.t@tokyo-adventure.jp",
    preferredPark: "Minneriya National Park",
    message: "We are a family of 5 planning to visit Minneriya in September. Can you organize hotel transfers from Habarana?",
    status: "in_progress",
    createdAt: new Date().toISOString(),
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Data states
  const [bookings, setBookings] = useState<BookingDoc[]>(MOCK_BOOKINGS);
  const [inquiries, setInquiries] = useState<InquiryDoc[]>(MOCK_INQUIRIES);
  const [packages, setPackages] = useState<SafariPackageDoc[]>([]);
  const [destinations, setDestinations] = useState<ParkDestinationDoc[]>([]);
  const [fleet, setFleet] = useState<JeepVehicleDoc[]>([]);
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }

    setIsAuthenticated(true);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as AdminTab | null;
      if (tabParam && ["overview", "bookings", "inquiries", "packages", "parks", "fleet", "reviews"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        const [pkgs, vhcls, revs, dests] = await Promise.all([
          getPackagesFromFirestore(),
          getFleetFromFirestore(),
          getReviewsFromFirestore(),
          getDestinationsFromFirestore(),
        ]);
        setPackages(pkgs);
        setFleet(vhcls);
        setReviews(revs);
        setDestinations(dests);
      } catch (err) {
        console.error("Error loading admin data from Firestore:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [router]);

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingDoc["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: InquiryDoc["status"]) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );
  };

  const handleTriggerSeed = async () => {
    setIsSeeding(true);
    try {
      await seedFirestoreDatabase();
      const [pkgs, vhcls, revs, dests] = await Promise.all([
        getPackagesFromFirestore(),
        getFleetFromFirestore(),
        getReviewsFromFirestore(),
        getDestinationsFromFirestore(),
      ]);
      setPackages(pkgs);
      setFleet(vhcls);
      setReviews(revs);
      setDestinations(dests);
    } finally {
      setIsSeeding(false);
    }
  };

  const session = getAdminSession();
  const pendingBookingsCount = bookings.filter((b) => b.status === "pending").length;
  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4 font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-300 text-sm font-semibold">Loading Wildking Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingBookingsCount={pendingBookingsCount}
        newInquiriesCount={newInquiriesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 space-y-6 overflow-y-auto max-h-screen">
        {/* Tab Views */}
        {activeTab === "overview" && (
          <OverviewStats
            bookings={bookings}
            inquiries={inquiries}
            onTriggerSeed={handleTriggerSeed}
            isSeeding={isSeeding}
            setActiveTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsManager
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
          />
        )}

        {activeTab === "inquiries" && (
          <InquiriesManager
            inquiries={inquiries}
            onUpdateStatus={handleUpdateInquiryStatus}
          />
        )}

        {activeTab === "packages" && (
          <PackagesManager packages={packages} />
        )}

        {activeTab === "parks" && (
          <ParksManager destinations={destinations} />
        )}

        {activeTab === "fleet" && (
          <FleetManager fleet={fleet} />
        )}

        {activeTab === "reviews" && (
          <ReviewsManager reviews={reviews} />
        )}
      </main>
    </div>
  );
}
