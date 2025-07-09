import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';


export async function GET() {
  const users = await prisma.user.findMany({});
  return NextResponse.json(users);
}

export async function POST(req) {
  try {
    const body = await req.json()
    const pass = CryptoJS.AES.encrypt(body.password, `${process.env.CRYPTOJS_SECRET}`).toString()


    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const newUser = await prisma.user.create({
      data: {
        name: body.name || null,
        email: body.email,
        phone: body.phone ? parseInt(body.phone) : null,
        password: pass || null,
        image: body.image || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png",
        provider: body.provider || "form",
      }
    })

    return NextResponse.json(newUser)
  } catch (error) {
    console.error("POST /api/users error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}