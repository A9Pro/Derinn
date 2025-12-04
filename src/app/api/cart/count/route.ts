import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Guest cart is tracked with a guestId cookie
    let guestId = cookies().get("guestId")?.value;

    // If no guestId exists, return 0 (empty cart)
    if (!guestId) {
      return NextResponse.json({ count: 0 });
    }

    // Find cart by guestId
    const savedCart = await prisma.savedCart.findUnique({
      where: { cartCode: guestId },
      include: { items: true },
    });

    return NextResponse.json({
      count: savedCart?.items?.length || 0,
    });
  } catch (err) {
    console.error("Cart count error:", err);
    return NextResponse.json({ count: 0 });
  }
}
