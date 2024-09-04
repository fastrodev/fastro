export type UserArgsType = {
    username: string;
    email: string;
    password: string;
    image?: string;
};

export type UserType = {
    userId: string;
    active: boolean;
} & UserArgsType;
