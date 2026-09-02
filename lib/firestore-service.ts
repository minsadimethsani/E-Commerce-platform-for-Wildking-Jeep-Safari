import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  SAFARI_PACKAGES,
  JEEP_FLEET,
  PARK_DESTINATIONS,
  REVIEWS,
} from "../data/packages";
import {
  SafariPackageDoc,
  JeepVehicleDoc,
  ParkDestinationDoc,
  ReviewDoc,
  BookingDoc,
  InquiryDoc,
  UserDoc,
  GuideDoc,
  PromotionDoc,
} from "./types/firestore";

export type BookingInput = Omit<BookingDoc, "id" | "createdAt" | "status" | "paymentStatus"> & {
  status?: BookingDoc["status"];
  paymentStatus?: BookingDoc["paymentStatus"];
};

export type InquiryInput = Omit<InquiryDoc, "id" | "createdAt" | "status"> & {
  status?: InquiryDoc["status"];
};

// ----------------------------------------------------
// Database Seeding Logic
// ----------------------------------------------------
export async function seedFirestoreDatabase() {
  const results = {
    packagesCount: 0,
    fleetCount: 0,
    destinationsCount: 0,
    reviewsCount: 0,
  };

  try {
    // 1. Seed Packages collection
    for (const pkg of SAFARI_PACKAGES) {
      const ref = doc(db, "packages", pkg.id);
      await setDoc(ref, { ...pkg, updatedAt: serverTimestamp() }, { merge: true });
      results.packagesCount++;
    }

    // 2. Seed Fleet collection
    for (const vehicle of JEEP_FLEET) {
      const ref = doc(db, "fleet", vehicle.id);
      await setDoc(ref, { ...vehicle, updatedAt: serverTimestamp() }, { merge: true });
      results.fleetCount++;
    }

    // 3. Seed Destinations collection
    for (const dest of PARK_DESTINATIONS) {
      const ref = doc(db, "destinations", dest.id);
      await setDoc(ref, { ...dest, updatedAt: serverTimestamp() }, { merge: true });
      results.destinationsCount++;
    }

    // 4. Seed Reviews collection
    for (const rev of REVIEWS) {
      const ref = doc(db, "reviews", rev.id);
      await setDoc(ref, { ...rev, updatedAt: serverTimestamp() }, { merge: true });
      results.reviewsCount++;
    }

    console.log("Firestore Seeding Complete:", results);
    return { success: true, results };
  } catch (error: any) {
    console.error("Error seeding Firestore database:", error);
    return { success: false, error: error.message || error };
  }
}

// ----------------------------------------------------
// Data Retrieval Operations
// ----------------------------------------------------
export async function getPackagesFromFirestore(): Promise<SafariPackageDoc[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "packages"));
    if (querySnapshot.empty) {
      return SAFARI_PACKAGES as SafariPackageDoc[];
    }
    const packages: SafariPackageDoc[] = [];
    querySnapshot.forEach((snap: QueryDocumentSnapshot<DocumentData>) => {
      packages.push(snap.data() as SafariPackageDoc);
    });
    return packages;
  } catch (error) {
    console.warn("Firestore fetch packages fallback to local data:", error);
    return SAFARI_PACKAGES as SafariPackageDoc[];
  }
}

export async function getFleetFromFirestore(): Promise<JeepVehicleDoc[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "fleet"));
    if (querySnapshot.empty) {
      return JEEP_FLEET as JeepVehicleDoc[];
    }
    const fleet: JeepVehicleDoc[] = [];
    querySnapshot.forEach((snap: QueryDocumentSnapshot<DocumentData>) => {
      fleet.push(snap.data() as JeepVehicleDoc);
    });
    return fleet;
  } catch (error) {
    console.warn("Firestore fetch fleet fallback to local data:", error);
    return JEEP_FLEET as JeepVehicleDoc[];
  }
}

export async function getDestinationsFromFirestore(): Promise<ParkDestinationDoc[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "destinations"));
    if (querySnapshot.empty) {
      return PARK_DESTINATIONS as ParkDestinationDoc[];
    }
    const dests: ParkDestinationDoc[] = [];
    querySnapshot.forEach((snap: QueryDocumentSnapshot<DocumentData>) => {
      dests.push(snap.data() as ParkDestinationDoc);
    });
    return dests;
  } catch (error) {
    console.warn("Firestore fetch destinations fallback to local data:", error);
    return PARK_DESTINATIONS as ParkDestinationDoc[];
  }
}

export async function getReviewsFromFirestore(): Promise<ReviewDoc[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    if (querySnapshot.empty) {
      return REVIEWS as ReviewDoc[];
    }
    const reviews: ReviewDoc[] = [];
    querySnapshot.forEach((snap: QueryDocumentSnapshot<DocumentData>) => {
      reviews.push(snap.data() as ReviewDoc);
    });
    return reviews;
  } catch (error) {
    console.warn("Firestore fetch reviews fallback to local data:", error);
    return REVIEWS as ReviewDoc[];
  }
}

// ----------------------------------------------------
// Write Mutations (Bookings, Inquiries, User Profiles)
// ----------------------------------------------------
export async function createBookingInFirestore(booking: BookingInput) {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...booking,
      status: booking.status || "confirmed",
      paymentStatus: booking.paymentStatus || "paid",
      createdAt: serverTimestamp(),
    });
    return { success: true, bookingId: docRef.id };
  } catch (error: any) {
    console.error("Failed to create booking in Firestore:", error);
    throw new Error(error.message || "Failed to submit booking");
  }
}

export async function createInquiryInFirestore(inquiry: InquiryInput) {
  try {
    const docRef = await addDoc(collection(db, "inquiries"), {
      ...inquiry,
      status: inquiry.status || "new",
      createdAt: serverTimestamp(),
    });
    return { success: true, inquiryId: docRef.id };
  } catch (error: any) {
    console.error("Failed to create inquiry in Firestore:", error);
    throw new Error(error.message || "Failed to submit inquiry");
  }
}

export async function saveUserProfileInFirestore(user: UserDoc) {
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      ...user,
      lastLoginAt: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save user profile in Firestore:", error);
    throw new Error(error.message || "Failed to save user profile");
  }
}

export async function savePackageInFirestore(pkg: SafariPackageDoc) {
  try {
    const pkgRef = doc(db, "packages", pkg.id);
    await setDoc(
      pkgRef,
      {
        ...pkg,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save package in Firestore:", error);
    return { success: false, error: error.message || error };
  }
}

export async function saveParkInFirestore(park: ParkDestinationDoc) {
  try {
    const parkRef = doc(db, "destinations", park.id);
    await setDoc(
      parkRef,
      {
        ...park,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save safari park in Firestore:", error);
    return { success: false, error: error.message || error };
  }
}


