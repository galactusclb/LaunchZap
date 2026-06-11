export const productStatus = [
    "PENDING",
    "APPROVED",
    "REJECTED"
] as const;

export type ProductStatus = typeof productStatus;
