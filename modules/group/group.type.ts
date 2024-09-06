export type GroupArgType = {
    name: string;
    module?: string;
};

export type GroupType = {
    groupId: string;
    active: boolean;
} & GroupArgType;
