import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("email");

        console.log('UserEmail: ', userEmail);

        if (!userEmail) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                address: true,
            },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });
    }
    catch (error) {
        console.error("GET /api/updateUser error:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("email");
        const body = await req.json();
        console.log('Request Body: ', body);
        // const { userId, name, email, phone, image } = body;

        if (!body.email) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { email: userEmail },
            data: {
                name: body.name || undefined,
                email: body.email || undefined,
                phone: body.phone || null,
                address: body.address || null
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("POST /api/updateUser error:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}