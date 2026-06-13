export const RoleList = ['USER', 'ADMIN'] as const;
export type Role = (typeof RoleList)[number];
