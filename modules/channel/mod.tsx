import { useEffect, useRef, useState } from "preact/hooks";

export const useBroadcastChannel = (channelName: string) => {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const channel = new BroadcastChannel(channelName);

            const handleMessage = (event: MessageEvent) => {
                setMessage(event.data);
            };

            channel.onmessage = handleMessage;

            return () => {
                channel.close();
            };
        }
    }, [channelName]);

    const sendMessage = (msg: string) => {
        if (typeof window !== "undefined") {
            const channel = new BroadcastChannel(channelName);
            channel.postMessage(msg);
        }
    };

    return { message, sendMessage };
};
