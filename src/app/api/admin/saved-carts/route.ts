import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all saved carts or get by cart code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartCode = searchParams.get("cartCode");

    if (cartCode) {
      // Fetch specific cart by code
      const cart = await prisma.savedCart.findUnique({
        where: { cartCode },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  productNumber: true,
                  imageUrl: true,
                  price: true,
                  stock: true,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        return NextResponse.json(
          { error: "Cart not found" },
          { status: 404 }
        );
      }

      // Check if expired
      if (new Date(cart.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: "Cart has expired" },
          { status: 410 }
        );
      }

      return NextResponse.json(cart);
    }

    // Fetch all carts (for admin)
    const carts = await prisma.savedCart.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                productNumber: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(carts);
  } catch (error) {
    console.error("Error fetching saved carts:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved carts" },
      { status: 500 }
    );
  }
}

// POST - Create new saved cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart must have at least one item" },
        { status: 400 }
      );
    }

    // Generate unique ED-#### code
    let cartCode: string;
    let isUnique = false;

    while (!isUnique) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      cartCode = `ED-${randomNum}`;

      const existing = await prisma.savedCart.findUnique({
        where: { cartCode },
      });

      if (!existing) {
        isUnique = true;
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.priceAtAdd * item.quantity,
      0
    );

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create saved cart with items
    const savedCart = await prisma.savedCart.create({
      data: {
        cartCode: cartCode!,
        email: email || null,
        totalAmount,
        expiresAt,
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            priceAtAdd: item.priceAtAdd,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(savedCart, { status: 201 });
  } catch (error) {
    console.error("Error creating saved cart:", error);
    return NextResponse.json(
      { error: "Failed to create saved cart" },
      { status: 500 }
    );
  }
}

// DELETE - Delete saved cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    await prisma.savedCart.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 }
    );
  }
}