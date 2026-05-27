import {db} from "../../../../index"
import {users, professionals} from "../../../../db/schema"
import {NextResponse} from "next/server";
import {eq} from "drizzle-orm";


import { applyProfessionalSchema } from "../../../../middleware/applyProfessionalSchema";
import { getAuthUser } from "@/src/middleware/getAuthUser";


export async function POST(req: Request) {
  
  try {

      const authUser = await getAuthUser();
      if (!authUser) {
            return NextResponse.json(
                {
                success: false,
                message: "Unauthorized",
                },
                { status: 401 }
            );
            }

    const body = await req.json();


   

    const validatedData =
      applyProfessionalSchema.parse(body);


  

    // replace later with JWT/session user
    const loggedInUserId = authUser.user_id;


    

    const user = await db
      .select()
      .from(users)
      .where(eq(users.user_id, loggedInUserId))
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }


  

    const existingProfessional = await db
      .select()
      .from(professionals)
      .where(
        eq(
          professionals.user_id,
          loggedInUserId
        )
      )
      .then((rows) => rows[0]);

    if (existingProfessional) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Professional profile already exists",
        },
        { status: 400 }
      );
    }




   await db.transaction(async (tx) => {

    await tx.insert(professionals).values({
        user_id: authUser.user_id,
        description: validatedData.description,
        service_charge: validatedData.service_charge,
        experience_years:
        validatedData.experience_years,
    });

    await tx
        .update(users)
        .set({
        account_type: "PROFESSIONAL",
        })
        .where(
        eq(users.user_id, authUser.user_id)
        );
});


    

    return NextResponse.json(
      {
        success: true,
        message:
          "Professional account created successfully",
      },
      { status: 201 }
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}