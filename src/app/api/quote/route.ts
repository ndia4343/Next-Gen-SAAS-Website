import { NextRequest, NextResponse } from "next/server";
import { QuoteSchema } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request payload via Zod
    const validationResult = QuoteSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please verify your form inputs.",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, selectedService } = validationResult.data;

    // Generate unique inquiry ID
    const inquiryId = `INQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Return structured JSON { success: true, message: string, inquiryId: string }
    return NextResponse.json(
      {
        success: true,
        message: `Thank you, ${name}! Your inquiry for ${selectedService} has been registered successfully. Our architects will contact you within 24 hours.`,
        inquiryId,
        quoteId: inquiryId, // Backward compatibility with previous clients
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected internal server error occurred while processing your quote inquiry.",
      },
      { status: 500 }
    );
  }
}
