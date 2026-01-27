// app/api/sop/notify/route.ts
import { NextResponse } from "next/server";
import { notifyUsersBySOP } from "@/actions/sops/notifyUsersBySOP";

export async function POST(req: Request) {
  const { sopId } = await req.json();

  // fire & forget (no await)
  notifyUsersBySOP(sopId).catch(console.error);

  return NextResponse.json({ success: true });
}
