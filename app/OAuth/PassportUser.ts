export type PassportUser = {
    id: string,
    name: string,
    token: any,
    emails: string[],
    photos: string[],
    provider: "facebook" | "google";
};

export const passportUsers = new Map<string, PassportUser>();