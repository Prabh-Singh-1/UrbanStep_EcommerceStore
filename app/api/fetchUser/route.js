import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;
    console.log('email ', email);
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bytes = CryptoJS.AES.decrypt(user.password, `${process.env.CRYPTOJS_SECRET}`);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    const isMatch = password === originalPassword;


    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, `${process.env.JWT_SECRET}`, { expiresIn: '1d' });
    
    return NextResponse.json(token);

  } catch (error) {
    console.error("Error in fetchUser:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}