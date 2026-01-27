import { NextResponse } from "next/server";
import { createNotification } from "@/actions/sops/createNotification";

export async function POST(req: Request) {
  const payload = await req.json();
  createNotification(payload).catch(console.error);
  return NextResponse.json({ success: true });
}
