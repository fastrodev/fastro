// deno-lint-ignore-file
import { useEffect, useRef, useState } from "preact/hooks";
const useWebSocket = (url: string) => {
    const [message, setMessage] = useState<string>("");
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<any>(null);

    const connectWebSocket = () => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            setIsConnected(true);
            console.log("WebSocket connection established.");
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };

        socketRef.current.onmessage = (event) => {
            setMessage(event.data);
        };

        socketRef.current.onclose = () => {
            setIsConnected(false);
            console.log(
                "WebSocket connection closed. Attempting to reconnect...",
            );
            reconnect();
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            socketRef.current?.close();
        };
    };

    const reconnect = () => {
        reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Reconnecting...");
            connectWebSocket();
        }, 1000);
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            socketRef.current?.close();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.send(message);
        }
    };

    return { message, sendMessage, isConnected };
};

export default useWebSocket;
