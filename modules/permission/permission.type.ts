export type PermissionOpType = "read" | "write" | "execute";

export type PermissionArgsType = {
    groupId: string;
    userId: string;
    permission: PermissionOpType[];
    module?: string;
};

export type PermissionType = {
    active: boolean;
    permissionId: string;
} & PermissionArgsType;
