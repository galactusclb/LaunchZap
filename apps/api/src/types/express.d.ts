import { User } from '@/features/auth/auth.schema';

declare global {
    namespace Express {
        interface Request {
            validatedQuery?: unknown;
            validatedBody?: unknown;
            validatedParams?: unknown;
            validatedHeaders?: unknown;
            user?: Pick<User, 'id' | 'role' | 'email'>;
        }
    }
}
