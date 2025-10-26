export const Tab = {
    ACTIVE: "ACTIVE",
    ARCHIVE: "ARCHIVE"
} as const;
export type Tab = typeof Tab[keyof typeof Tab];