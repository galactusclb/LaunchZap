'use server';

export type LoginState = {
    success: boolean;
    message?: string;
    error?: string;
};

export default async function loginAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(`Login processing: ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (email !== 'admin@gmail.com') {
        return {
            success: false,
            message: 'Invalid credentials',
        };
    }

    return { success: true };
}
