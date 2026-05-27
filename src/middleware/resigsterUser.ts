import {z}  from "zod"
import {NextResponse} from "next/server"


export const registerSchema = z.object({
    user_name: z.string().min(3, "Username must be at least 3 characters long"),
    user_email: z.string().email("Invalid email address"),
    user_number: z.string().min(10, "Phone number must be at least 10 digits long"),
    city: z.string().min(2, "City must be at least 2 characters long"),
    state: z.string().min(2, "State must be at least 2 characters long"),
    pincode: z.string().min(5, "Pincode must be at least 5 digits long"),
    address: z.string().min(5, "Address must be at least 5 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});


export const handleRegister =  async (request: Request) => {
   try {

    const body = await request.json();
    const result = registerSchema.safeParse(body);
     if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten(),
      };
    }
    return {
      success: true,
      data: result.data,
    };

    
} catch (error) {
    return {
      success: false,
      errors: "Invalid request body",
    };
  }
}

