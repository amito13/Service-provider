import { z } from "zod";

export const applyProfessionalSchema = z.object({
  description: z
    .string()
    .min(20, "Description too short"),

  service_charge: z
    .number()
    .positive(),

  experience_years: z
    .number()
    .min(0),
});