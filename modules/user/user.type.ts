type UserType = {
    id?: string;
    username: string;
    email: string;
    password: string;
    group?: string[];
    image?: string;
};

export default UserType;
