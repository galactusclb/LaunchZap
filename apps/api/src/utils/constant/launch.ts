export const launchStatus = [
    "PENDING",
    "APPROVED",
    "REJECTED"
] as const;

export type LaunchStatus = typeof launchStatus;