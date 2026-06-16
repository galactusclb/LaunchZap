export const launchStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    HIDE: 'HIDE',
} as const;

export type LaunchStatus = (typeof launchStatus)[keyof typeof launchStatus];
