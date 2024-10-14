import { useEffect, useRef, useState } from "preact/hooks";

const useWebSocket = (url: string) => {
    const [message, setMessage] = useState<string>("");
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            setIsConnected(true);
            console.log("WebSocket connection established.");
        };

        socketRef.current.onmessage = (event) => {
            setMessage(event.data);
        };

        socketRef.current.onclose = () => {
            setIsConnected(false);
            console.log("WebSocket connection closed.");
        };

        return () => {
            socketRef.current?.close();
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
