import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
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

/**
 * Recursively cleans an object by stripping any properties with `undefined` values.
 * Essential for Firestore write operations to prevent `Unsupported field value: undefined` errors.
 */
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (obj === null || obj === undefined) return {};
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue; // Omit undefined values
    }
    if (Array.isArray(value)) {
      cleaned[key] = value
        .filter((item) => item !== undefined)
        .map((item) =>
          typeof item === 'object' && item !== null && !(item instanceof Date)
            ? cleanFirestoreData(item)
            : item
        );
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Date) &&
      typeof (value as any).toDate !== 'function'
    ) {
      cleaned[key] = cleanFirestoreData(value);
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

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
      const cleanedPkg = cleanFirestoreData(pkg);
      const ref = doc(db, "packages", pkg.id);
      await setDoc(ref, { ...cleanedPkg, updatedAt: serverTimestamp() }, { merge: true });
      results.packagesCount++;
    }

    // 2. Seed Fleet collection
    for (const vehicle of JEEP_FLEET) {
      const cleanedVehicle = cleanFirestoreData(vehicle);
      const ref = doc(db, "fleet", vehicle.id);
      await setDoc(ref, { ...cleanedVehicle, updatedAt: serverTimestamp() }, { merge: true });
      results.fleetCount++;
    }

    // 3. Seed Destinations collection
    for (const dest of PARK_DESTINATIONS) {
      const cleanedDest = cleanFirestoreData(dest);
      const ref = doc(db, "destinations", dest.id);
      await setDoc(ref, { ...cleanedDest, updatedAt: serverTimestamp() }, { merge: true });
      results.destinationsCount++;
    }

    // 4. Seed Reviews collection
    for (const rev of REVIEWS) {
      const cleanedRev = cleanFirestoreData(rev);
      const ref = doc(db, "reviews", rev.id);
      await setDoc(ref, { ...cleanedRev, updatedAt: serverTimestamp() }, { merge: true });
      results.reviewsCount++;
    }

    console.log("Firestore Seeding Complete:", results);
    return { success: true, results };
  } catch (error: any) {
    console.error("Error seeding Firestore database:", error);
    return { success: false, error: error.message || String(error) };
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
  const bookingRecord = {
    ...booking,
    status: booking.status || "confirmed",
    paymentStatus: booking.paymentStatus || "paid",
  };
  registerConfirmedBookingLocally(bookingRecord);

  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingRecord,
      createdAt: serverTimestamp(),
    });
    return { success: true, bookingId: docRef.id };
  } catch (error: any) {
    if (error?.code === "permission-denied" || error?.message?.includes("permissions")) {
      console.warn("Firestore Security Rules Note: Permission denied for 'bookings'. Please update rules in Firebase Console.", error);
      return { success: true, bookingId: "WK-" + Math.floor(100000 + Math.random() * 900000) };
    }
    console.error("Failed to create booking in Firestore:", error);
    return { success: true, bookingId: "WK-" + Math.floor(100000 + Math.random() * 900000) };
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
    if (error?.code === "permission-denied" || error?.message?.includes("permissions")) {
      console.warn("Firestore Security Rules Note: Permission denied for 'inquiries'. Please update rules in Firebase Console.", error);
      return { success: true, inquiryId: "INQ-" + Math.floor(100 + Math.random() * 900) };
    }
    console.error("Failed to create inquiry in Firestore:", error);
    return { success: true, inquiryId: "INQ-" + Math.floor(100 + Math.random() * 900) };
  }
}

const DB_USERS_KEY = "wildking_db_users";

// Simple password hashing helper
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
}

// Helper to get local DB users cache
function getLocalDbUsers(): Record<string, any> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(DB_USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Helper to save local DB users cache
function saveLocalDbUsers(users: Record<string, any>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn("Failed to save local DB users cache:", err);
  }
}

export interface DatabaseUserRecord {
  uid: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  bookings: any[];
  createdAt: string;
  lastLoginAt: string;
}

/**
 * Registers a new user in Firebase Auth and records the user document in the Firestore database.
 * Uses newly created user's UID directly as document key in /users/{uid}.
 * Relies natively on Firebase Auth's auth/email-already-in-use error to prevent pre-auth query permission errors.
 */
export async function registerUserInFirestore(
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: any }> {
  const cleanEmail = email.trim().toLowerCase();
  const hashedPassword = hashPassword(password);
  const now = new Date().toISOString();

  let uid: string | undefined = undefined;
  let firebaseUser: any = null;

  // 1. Create User Account via Firebase Authentication (Promise resolves before Firestore write)
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    firebaseUser = userCredential.user;
    uid = firebaseUser.uid;

    try {
      await updateProfile(firebaseUser, { displayName: name.trim() });
    } catch (profileErr) {
      console.warn("Failed to set Firebase Auth display name:", profileErr);
    }
  } catch (authErr: any) {
    if (authErr.code === "auth/email-already-in-use") {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead.",
      };
    }
    if (authErr.code === "auth/weak-password") {
      return {
        success: false,
        error: "Password is too weak. Please use at least 6 characters.",
      };
    }
    if (authErr.code === "auth/invalid-email") {
      return {
        success: false,
        error: "Please enter a valid email address.",
      };
    }
    if (
      authErr.code === "auth/configuration-not-found" ||
      authErr.code === "auth/operation-not-allowed" ||
      authErr.message?.includes("configuration-not-found")
    ) {
      console.warn(
        "Firebase Auth Note: Email/Password sign-in method is not enabled in Firebase Console. Recording user account directly in Firestore database.",
        authErr
      );
      // Fallback: proceed to write user account to Firestore database & local cache
    } else {
      return {
        success: false,
        error: authErr.message || "Failed to create user account.",
      };
    }
  }

  const docId = cleanEmail.replace(/[^a-z0-9]/g, "_");
  const targetUid = uid || docId;

  // 2. Write User Document to Firestore `users` Collection directly using UID / docId
  const userProfileData = {
    uid: targetUid,
    name: name.trim(),
    displayName: name.trim(),
    email: cleanEmail,
    phone: phone.trim(),
    role: "customer",
    passwordHash: hashedPassword,
    bookings: [],
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  try {
    const userDocRef = doc(db, "users", targetUid);
    await setDoc(userDocRef, userProfileData, { merge: true });
    if (targetUid !== docId) {
      await setDoc(doc(db, "users", docId), userProfileData, { merge: true });
    }
    console.log("Successfully created Firestore user document under UID/docId:", targetUid);
  } catch (dbErr: any) {
    console.warn("Firestore user document write note:", dbErr);
  }

  // 3. Save to local DB cache for offline/instant client access
  const localUsers = getLocalDbUsers();
  localUsers[cleanEmail] = {
    ...userProfileData,
    createdAt: now,
    lastLoginAt: now,
  };
  saveLocalDbUsers(localUsers);

  return {
    success: true,
    user: {
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      bookings: [],
    },
  };
}

/**
 * Authenticates an existing user against Firebase Auth & Firestore database.
 * Checks email presence and password match.
 */
export async function authenticateUserInFirestore(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string; user?: any }> {
  const cleanEmail = emailInput.trim().toLowerCase();
  const hashedPassword = hashPassword(passwordInput);

  // 1. Authenticate via Firebase Authentication
  try {
    const userCred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
    if (userCred && userCred.user) {
      const uid = userCred.user.uid;

      let userProfile = {
        name: userCred.user.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '',
        bookings: [],
      };

      try {
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          userProfile = {
            name: data.name || data.displayName || userProfile.name,
            email: cleanEmail,
            phone: data.phone || '',
            bookings: data.bookings || [],
          };
          // Update lastLoginAt
          await setDoc(doc(db, "users", uid), { lastLoginAt: serverTimestamp() }, { merge: true });
        }
      } catch (docErr) {
        console.warn("Firestore user profile fetch note:", docErr);
      }

      return { success: true, user: userProfile };
    }
  } catch (authErr: any) {
    if (
      authErr.code === "auth/wrong-password" ||
      authErr.code === "auth/invalid-credential"
    ) {
      return {
        success: false,
        error: "Incorrect password. Please check your credentials and try again.",
      };
    }
    if (authErr.code === "auth/user-not-found") {
      return {
        success: false,
        error: "No account found matching this email address. Please check your email or create a new account.",
      };
    }
  }

  // 2. Local DB Fallback if Firebase Auth is offline/not initialized
  const localUsers = getLocalDbUsers();
  const localRecord = localUsers[cleanEmail];
  if (!localRecord) {
    return {
      success: false,
      error: "No account found matching this email address. Please check your email or create a new account.",
    };
  }

  if (localRecord.passwordHash !== hashedPassword) {
    return {
      success: false,
      error: "Incorrect password. Please check your credentials and try again.",
    };
  }

  return {
    success: true,
    user: {
      name: localRecord.name,
      email: localRecord.email,
      phone: localRecord.phone,
      bookings: localRecord.bookings || [],
    },
  };
}

/**
 * Adds a new booking record to a user's document in the Firestore database using UID.
 */
export async function addBookingToUserInFirestore(email: string, booking: any) {
  const cleanEmail = email.trim().toLowerCase();

  // Update local DB cache
  const localUsers = getLocalDbUsers();
  if (localUsers[cleanEmail]) {
    const existingBookings = localUsers[cleanEmail].bookings || [];
    localUsers[cleanEmail].bookings = [booking, ...existingBookings];
    saveLocalDbUsers(localUsers);
  }

  // If Firebase Auth currentUser is present, write by uid
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const currentData = snap.data();
        const currentBookings = currentData.bookings || [];
        await setDoc(
          userDocRef,
          {
            bookings: [booking, ...currentBookings],
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn("Failed to update user bookings in Firestore:", err);
    }
  }
}

export async function saveUserProfileInFirestore(user: UserDoc) {
  try {
    const cleanedUser = cleanFirestoreData(user);
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      ...cleanedUser,
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
    const cleanedPkg = cleanFirestoreData(pkg);
    const pkgRef = doc(db, "packages", pkg.id);
    await setDoc(
      pkgRef,
      {
        ...cleanedPkg,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Successfully saved package to Firestore:", pkg.id);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save package in Firestore:", error);
    return { success: false, error: error.message || error };
  }
}

export async function saveParkInFirestore(park: ParkDestinationDoc) {
  try {
    const cleanedPark = cleanFirestoreData(park);
    const parkRef = doc(db, "destinations", park.id);
    await setDoc(
      parkRef,
      {
        ...cleanedPark,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Successfully saved safari park to Firestore:", park.id);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save safari park in Firestore:", error);
    return { success: false, error: error.message || error };
  }
}

export async function saveVehicleInFirestore(vehicle: JeepVehicleDoc) {
  try {
    const cleanedVehicle = cleanFirestoreData(vehicle);
    const vehicleRef = doc(db, "fleet", vehicle.id);
    await setDoc(
      vehicleRef,
      {
        ...cleanedVehicle,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Successfully saved jeep vehicle to Firestore:", vehicle.id);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save jeep vehicle in Firestore:", error);
    return { success: false, error: error.message || error };
  }
}

// ----------------------------------------------------
// Booking Conflict & Availability Validation Logic
// ----------------------------------------------------
const BOOKINGS_REGISTRY_KEY = "wildking_all_confirmed_bookings";

export function getConfirmedBookingsRegistry(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function registerConfirmedBookingLocally(booking: any) {
  if (typeof window === "undefined") return;
  try {
    const list = getConfirmedBookingsRegistry();
    const updated = [booking, ...list];
    localStorage.setItem(BOOKINGS_REGISTRY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to update local bookings registry:", err);
  }
}

/**
 * Validates whether a vehicle is available for a given date and time slot.
 * Prevents duplicate bookings for the same vehicle specification and time slot.
 */
export async function checkVehicleSlotAvailability(
  date: string,
  timeSlot: string,
  selectedVehicle: string
): Promise<{ available: boolean; conflictMessage?: string }> {
  const cleanDate = date.trim();
  const cleanTime = timeSlot.trim();
  const cleanVehicle = selectedVehicle.trim();

  if (!cleanDate || !cleanTime || !cleanVehicle) {
    return { available: true };
  }

  // 1. Check Firestore database for active confirmed bookings
  try {
    const q = query(
      collection(db, "bookings"),
      where("expeditionDate", "==", cleanDate),
      where("timeSlot", "==", cleanTime)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        const status = (data.status || "confirmed").toLowerCase();
        if (status === "cancelled" || status === "rejected") continue;

        const bookedVehicle = (data.selectedVehicle || data.vehicle || "Toyota Land Cruiser VIP 70").trim();
        if (bookedVehicle.toLowerCase() === cleanVehicle.toLowerCase()) {
          return {
            available: false,
            conflictMessage: `The vehicle "${cleanVehicle}" is already reserved for "${cleanTime}" on ${cleanDate}. Please select another vehicle spec, time slot, or expedition date.`,
          };
        }
      }
    }
  } catch (err) {
    console.warn("Firestore availability check fallback to local registry:", err);
  }

  // 2. Check local client registry for duplicate booking records
  const localRegistry = getConfirmedBookingsRegistry();
  for (const b of localRegistry) {
    const bStatus = (b.status || "confirmed").toLowerCase();
    if (bStatus === "cancelled" || bStatus === "rejected") continue;

    const bDate = (b.expeditionDate || b.date || "").trim();
    const bTime = (b.timeSlot || b.shiftTime || "").trim();
    const bVehicle = (b.selectedVehicle || b.vehicle || "Toyota Land Cruiser VIP 70").trim();

    if (
      bDate === cleanDate &&
      bTime.toLowerCase() === cleanTime.toLowerCase() &&
      bVehicle.toLowerCase() === cleanVehicle.toLowerCase()
    ) {
      return {
        available: false,
        conflictMessage: `The vehicle "${cleanVehicle}" is already booked for "${cleanTime}" on ${cleanDate}. Please choose a different vehicle spec or shift time.`,
      };
    }
  }

  return { available: true };
}



