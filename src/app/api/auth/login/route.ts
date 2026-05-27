import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import {db} from "../../../../index"
import {users} from "../../../../db/schema"

import { eq } from "drizzle-orm";

export async function POST(request: Request) {

  try {

    const { email, password } = await request.json();

    // check fields
    if (!email || !password) {

      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.user_email, email))
      .limit(1);

    // user not found
    if (user.length === 0) {

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user[0].hashed_password
    );

    // wrong password
    if (!isPasswordCorrect) {

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // generate jwt token
    const token = jwt.sign(
  {
    user_id: user[0].user_id,
    email: user[0].user_email,
    account_type: user[0].account_type,
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: "7d",
  }
  );

    // response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",

        user: {
          id: user[0].user_id,
          username: user[0].user_name,
          email: user[0].user_email,
        },
      },
      { status: 200 }
    );

    // set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}