import type { DataType } from "@app/modules/types/mod.ts";
import { ulid } from "jsr:@std/ulid/ulid";
import { ulidToDate } from "@app/utils/ulid.ts";

const id = ulid();
const time = ulidToDate(id);

export const initialData: DataType[] = [
    {
        type: "message",
        username: "github-actions",
        img: "https://avatars.githubusercontent.com/in/15368?v=4",
        messages: [
            {
                msg: "Hello world!",
                time,
                id,
            },
        ],
    },
    {
        type: "message",
        username: "github-actions",
        img: "https://avatars.githubusercontent.com/in/15368?v=4",
        messages: [
            {
                msg: "What is your name?",
                time,
                id,
            },
            {
                msg: "Where is your address?",
                time,
                id,
            },
            {
                msg: "How old are you?",
                time,
                id,
            },
        ],
    },
];
