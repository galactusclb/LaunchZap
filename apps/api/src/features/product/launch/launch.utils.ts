export const getDateRange = (q: string): Date | undefined => {
    const now = new Date();
    const day = 1000 * 60 * 60 * 24;

    const ranges: Record<string, Date> = {
        daily: new Date(now.getTime() - day),
        weekly: new Date(now.getTime() - day * 7),
        hot: new Date(now.getTime() - day * 2),
    };

    return ranges[q];
};
