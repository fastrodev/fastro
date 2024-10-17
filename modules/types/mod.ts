export interface MessageType {
    msg: string;
    id: string;
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
