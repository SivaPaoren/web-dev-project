import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";        // ✅ default import
import Customer from "@/lib/Customer";
import mongoose from "mongoose";

const badId = (id) => !id || !mongoose.Types.ObjectId.isValid(id);

export async function GET(_, { params }) {
  try {
    await dbConnect();
    if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const doc = await Customer.findById(params.id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    console.error("GET /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = await req.json();
    const doc = await Customer.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    console.error("PUT /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await dbConnect();
    if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const doc = await Customer.findByIdAndDelete(params.id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
