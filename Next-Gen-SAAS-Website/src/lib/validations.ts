import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid business email address"),
  company: z.string().min(1, "Company or Project name is required").max(100),
  selectedService: z.enum([
    "Headless Ecommerce",
    "Agentic AI",
    "Idea to Launch",
    "01 / Software",
    "02 / Data",
    "03 / AI",
    "04 / Media",
    "General Discovery"
  ]),
  projectScope: z.string().min(10, "Please describe your project scope (minimum 10 characters)").max(2000),
  timeline: z.enum([
    "Immediate (< 1 month)",
    "1 - 3 months",
    "3 - 6 months",
    "Flexible / Exploring"
  ]),
  budgetRange: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
