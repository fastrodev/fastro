import type { User } from "@app/modules/types/mod.ts";

export const initialData: User[] = [
    {
        username: "github-actions",
        img: "https://avatars.githubusercontent.com/in/15368?v=4",
        messages: [
            { msg: "Hello world", id: "2024-10-01T15:30:00Z" },
            {
                msg: "What is your name? Where is your address? How old are you?",
                id: "2024-10-01T15:30:00Z",
            },
        ],
    },
    {
        username: "mike",
        img: "https://avatars.githubusercontent.com/u/157196041?v=4",
        messages: [
            { msg: "Hello world", id: "2024-10-02T15:31:00Z" },
            {
                msg: "My name is mike",
                id: "2024-10-02T15:31:00Z",
            },
        ],
    },
    {
        username: "john",
        img: "https://avatars.githubusercontent.com/u/65916846?v=4",
        messages: [
            { msg: "Hello world", id: "2024-10-11T15:31:00Z" },
            {
                msg: "My name is john",
                id: "2024-10-11T15:31:00Z",
            },
        ],
    },
    {
        username: "agus",
        img: "https://avatars.githubusercontent.com/u/218257?v=4",
        messages: [
            { msg: "Hello world", id: "2024-10-12T15:31:00Z" },
            {
                msg: "My name is agus. I'm come from indonesia. I'm 10 years old. a second-grade student. I'm a gamer. I like kebab",
                id: "2024-10-12T15:31:00Z",
            },
        ],
    },
];
