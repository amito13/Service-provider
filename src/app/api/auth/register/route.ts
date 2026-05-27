import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import {db} from "../../../../index"
import {users} from "../../../../db/schema"
import  {signJwt} from "../../../../../lib/jwt"
import {handleRegister} from "../../../../middleware/resigsterUser"

export async function POST(request: Request) {
    try {
       
        const validation = await handleRegister(request);
         if (!validation.success) {
            return NextResponse.json(
            {
            success: false,
            message: "Validation failed",
            errors: validation.errors,
            },
            { status: 400 }
             );
         }
         const validUser = validation.data;
          const hashedPassword = await bcrypt.hash(validUser!.password, 10);
            const newUser = await db.insert(users).values({
            user_name: validUser!.user_name,
            user_email: validUser!.user_email,
            user_number: validUser!.user_number,
            hashed_password: hashedPassword,
            city: validUser!.city,
            state: validUser!.state,
            pincode: validUser!.pincode,
            address: validUser!.address,
         });
      
        const token = signJwt({ email: validUser!.user_email }, process.env.JWT_SECRET as string);
        

        console.log("Registered user:", newUser);
        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                data: {user: newUser,token},
            },
            { status: 201 }
    );;
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 }
        );
    }
}
