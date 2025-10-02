import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";        // ✅ default import
import Customer from "@/lib/Customer";   // your TS model is fine to import

export async function GET() {
  try {
    await dbConnect();
    const data = await Customer.find().sort({ createdAt: -1 });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET /api/customers error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, dateOfBirth, memberNumber, interests } = body || {};

    if (!name || !dateOfBirth || !memberNumber || !interests) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const doc = await Customer.create({
      name: String(name).trim(),
      dateOfBirth: new Date(dateOfBirth),
      memberNumber: Number(memberNumber),
      interests: String(interests).trim(),
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error("POST /api/customers error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
