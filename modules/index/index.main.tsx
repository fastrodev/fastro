// deno-lint-ignore-file no-explicit-any
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { Message } from "@app/modules/index/index.message.tsx";
import useWebSocket from "@app/modules/hook/socket.ts";
import { formatTime, ulidToDate } from "@app/utils/ulid.ts";
import useFetch from "@app/modules/hook/fetch.ts";
import type { DataType, RoomType } from "@app/modules/types/mod.ts";
import { initialData } from "@app/modules/socket/init.ts";
import { AppContext } from "@app/modules/index/index.context.ts";
import { effect } from "https://esm.sh/@preact/signals@1.3.0";
import MessageInput from "@app/modules/index/index.input.tsx";

export function Main(
    props: { avatar_url: string; username: string; ws_url: string },
) {
    const state = useContext(AppContext);
    const [room, setRoom] = useState<RoomType>({
        name: "global",
        id: "01JAC4GM721KGRWZHG53SMXZP0",
    });
    const { data: d, loading, error } = useFetch<DataType[]>(
        `api/message/${room.id}/${props.username}`,
    );
    const [data, setData] = useState<DataType[]>(d as any);
    const { message, sendMessage } = useWebSocket(props.ws_url);

    const insertData = (newMessage: {
        msg: string;
        username: string;
        id: string;
    }) => {
        const updatedData = [...data];
        const lastUser = updatedData[updatedData.length - 1];
        const time = ulidToDate(newMessage.id);
        const msg = {
            type: "message",
            msg: newMessage.msg,
            id: newMessage.id,
            time,
        };

        if (lastUser.username === newMessage.username) {
            const lastUserMessages = lastUser.messages;
            lastUserMessages.push(msg);
        } else {
            updatedData.push({
                type: "message",
                username: newMessage.username,
                img: props.avatar_url,
                messages: [msg],
            });
        }

        setData(updatedData);
    };

    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [data]);

    useEffect(() => {
        if (message) {
            // console.log("message==>", message);
            insertData(JSON.parse(message));
        }
    }, [message]);

    useEffect(() => {
        if (d) {
            const arr = [...initialData];
            arr[0].messages[0].msg =
                `Hello ${props.username}! Welcome to ${room.name} room.`;

            const dd = [...arr, ...d];
            const ddd = dd.map((v) => {
                const msg = v.messages.map((m) => {
                    m.time = ulidToDate(m.id);
                    return m;
                });
                v.messages = msg;
                return v;
            });
            setData(ddd);
        }
    }, [d, initialData]);

    effect(() => {
        setRoom(state.room.value);
    });

    return (
        <>
            {loading
                ? (
                    <div class="grow h-screen max-w-8/12 flex justify-center bg-gray-950 border-t border-l border-r border-gray-700 p-4">
                        Loading
                    </div>
                )
                : (
                    <div class="bg-center bg-no-repeat relative grow h-screen max-w-8/12 flex flex-col justify-end bg-gray-950 border-t border-l border-r border-gray-700">
                        <div style="content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('/bg.png'); background-position: center; opacity: 0.1; z-index: 0;">
                        </div>
                        <div
                            ref={listRef}
                            class={`overflow-auto pt-3 mb-20 z-10`}
                        >
                            <ul class={`flex flex-col justify-end gap-y-2`}>
                                {data && data.map((item, index) => {
                                    return (
                                        <ul
                                            class={`px-4 text-sm flex flex-col justify-end gap-y-2`}
                                            key={index}
                                        >
                                            {item.messages.map((d, x) => {
                                                const idx = x;
                                                return (
                                                    <Message
                                                        id={d.id}
                                                        idx={idx}
                                                        msg={d.msg}
                                                        time={formatTime(
                                                            d.time,
                                                        )}
                                                        username={item.username}
                                                        img={item.img}
                                                    />
                                                );
                                            })}
                                        </ul>
                                    );
                                })}
                            </ul>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 p-3">
                            <MessageInput
                                avatar_url={props.avatar_url}
                                ws_url={props.ws_url}
                                username={props.username}
                                room={room}
                                sendMessage={sendMessage}
                            />
                        </div>
                    </div>
                )}
        </>
    );
}
