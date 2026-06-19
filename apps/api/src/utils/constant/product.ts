export const productStatus = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

export type ProductStatus = (typeof productStatus)[keyof typeof productStatus];
