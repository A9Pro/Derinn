import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const guestId = (await cookieStore).get("guestId")?.value;

    if (!guestId) {
      return NextResponse.json({ count: 0 });
    }

    const savedCart = await prisma.savedCart.findUnique({
      where: { cartCode: guestId },
      include: { items: true }, 
    });

    return NextResponse.json({
      count: savedCart?.items?.length ?? 0,
    });
  } catch (err) {
    console.error("Cart count error:", err);
    return NextResponse.json({ count: 0 });
  }
}
