import z from 'zod';

const trimmedString = z.string().trim();

const optionalText = trimmedString.transform((val) => (val === '' ? null : val));

const normalizedEmail = trimmedString.email().toLowerCase();

const intFromAny = z.coerce.number().int();

const httpUrl = z
    .url()
    .max(2048)
    .refine((u) => /^https?:\/\//i.test(u), { message: 'Only http/https URLs are allowed' });

export { httpUrl, intFromAny, normalizedEmail, optionalText, trimmedString };
