import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for Quote Lead validation
const quoteLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid business email address"),
  company: z.string().min(1, "Company or Project name is required").max(100),
  selectedService: z.string().min(1, "Service selection is required"),
  projectScope: z
    .string()
    .min(10, "Please describe your project scope (minimum 10 characters)")
    .max(2000),
  timeline: z.string().min(1, "Timeline is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request payload via Zod
    const validationResult = quoteLeadSchema.safeParse(body);

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
