export const ROUTES = {
    home: '/',
    login: '/login',
    submit: '/submit',
    dashboard: '/dashboard',
    launch: (id: string | number) => `/launch/${id}`,
} as const;

export const PROTECTED_ROUTES = [ROUTES.submit, ROUTES.dashboard] as const;

export const AUTH_ROUTES = [ROUTES.login] as const;
