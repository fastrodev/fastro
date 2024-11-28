export interface MessageType {
  msg: string;
  id: string;
  time: string;
}

export interface DataType {
  type: "message" | "ads" | "info";
  username: string;
  img: string;
  messages: MessageType[];
}

export interface RoomType {
  name: string;
  id: string;
}
