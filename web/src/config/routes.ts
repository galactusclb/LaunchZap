export const ROUTES = {
    home: '/',
    login: '/login',
    submit: '/submit',
    dashboard: '/dashboard',
} as const;

export const PROTECTED_ROUTES = [ROUTES.submit, ROUTES.dashboard] as const;

export const AUTH_ROUTES = [ROUTES.login] as const;
