import { z } from "zod";
import {
  tenantProfileSchema,
  landlordProfileSchema,
  enterpriseProfileSchema,
  userTypeEnum,
} from "@shared/schema";

export const usernameSchema = z.string().min(3, "Username must be at least 3 characters");
export const passwordSchema = z.string()
  .min(8, "Minimum 8 characters")
  .regex(/[A-Za-z]/, "Must include at least one letter")
  .regex(/[0-9]/, "Must include at least one number");

export const tenantRegisterSchema = z.object({
  userType: z.literal("tenant"),
  username: usernameSchema,
  password: passwordSchema,
  profile: tenantProfileSchema,
});

export const landlordRegisterSchema = z.object({
  userType: z.literal("landlord"),
  username: usernameSchema,
  password: passwordSchema,
  profile: landlordProfileSchema,
});

export const enterpriseRegisterSchema = z.object({
  userType: z.literal("enterprise"),
  username: usernameSchema,
  password: passwordSchema,
  profile: enterpriseProfileSchema,
});

export const registerDiscriminated = z.discriminatedUnion("userType", [
  tenantRegisterSchema,
  landlordRegisterSchema,
  enterpriseRegisterSchema,
]);

export type RegisterDiscriminated = z.infer<typeof registerDiscriminated>;

