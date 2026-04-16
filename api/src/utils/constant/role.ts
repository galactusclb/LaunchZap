import { User } from "@/features/auth/auth.schema";
import { Roles } from "@/prisma/client"

// export const Roles = ['USER', 'ADMIN'] as const;
export const RoleList = Roles
export type Role = User["role"];