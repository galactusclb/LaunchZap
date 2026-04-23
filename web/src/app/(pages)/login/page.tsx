import { LoginContainer } from '@/features/views/login';
import { type LoginSearchParams } from '@/features/views/login/schemas/login.schema';

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<LoginSearchParams>;
}) {
    return <LoginContainer searchParams={searchParams} />;
}
