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
                clearTimeout(reconnectTimeoutRef.current); // Clear any existing reconnect timeout
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
            reconnect(); // Start reconnection process
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            socketRef.current?.close(); // Close the socket on error
        };
    };

    const reconnect = () => {
        reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Reconnecting...");
            connectWebSocket(); // Attempt to reconnect
        }, 1000); // Adjust the delay as needed
    };

    useEffect(() => {
        connectWebSocket(); // Initial connection

        return () => {
            socketRef.current?.close();
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current); // Clear timeout on unmount
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
