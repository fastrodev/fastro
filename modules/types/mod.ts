export interface MessageType {
    msg: string;
    id: string;
    time: string;
}

export interface User {
    username: string;
    img: string;
    messages: MessageType[];
}

export interface RoomType {
    name: string;
    id: string;
}

export const NOT_FOUND = Response.json({ message: "Not found" }, {
    status: 404,
});
