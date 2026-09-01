import { NextResponse } from "next/server";
import { seedFirestoreDatabase } from "@/lib/firestore-service";

export async function GET() {
  const result = await seedFirestoreDatabase();
  if (result.success) {
    return NextResponse.json({
      message: "Firestore collections seeded successfully!",
      data: result.results,
    });
  } else {
    return NextResponse.json(
      { message: "Failed to seed Firestore collections", error: result.error },
      { status: 500 }
    );
  }
}

export async function POST() {
  const result = await seedFirestoreDatabase();
  if (result.success) {
    return NextResponse.json({
      message: "Firestore collections seeded successfully!",
      data: result.results,
    });
  } else {
    return NextResponse.json(
      { message: "Failed to seed Firestore collections", error: result.error },
      { status: 500 }
    );
  }
}
