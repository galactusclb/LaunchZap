import { Roles } from "@/prisma/client"
import { User } from "@/features/auth/auth.schema";

// export const Roles = ['USER', 'ADMIN'] as const;
export const RoleList = Roles
export type Role = User["role"];