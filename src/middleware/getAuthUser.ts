import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getAuthUser() {

  try {

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      user_id: number;
      account_type: string;
    };

    return decoded;

  } catch (error) {

    return null;
  }
}