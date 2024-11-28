// deno-lint-ignore-file
import { useEffect, useRef, useState } from "preact/hooks";

const useWebSocket = (url: string, room: string, user: string) => {
  const [message, setMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const messageQueueRef = useRef<string[]>([]);
  const countRef = useRef<number>(0);

  function ping(data: any) {
    const i = setInterval(() => {
      if (
        countRef.current > 1
      ) {
        setIsConnected(true);
        return clearInterval(i);
      }

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current?.send(
          JSON.stringify({
            ...{ type: "ping", room, user },
            ...data,
          }),
        );
        countRef.current++;
        return console.log(`WebSocket connection established: ${room}`);
      }

      console.log(`WebSocket connection closed: ${room}`);
    }, 300);
  }

  useEffect(() => {
    socketRef.current = new WebSocket(url);
    socketRef.current.onopen = () => {
      setIsConnected(true);
      while (messageQueueRef.current.length > 0) {
        const queuedMessage = messageQueueRef.current.shift();
        if (queuedMessage) {
          socketRef.current?.send(queuedMessage);
        }
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };

    socketRef.current.onmessage = (event) => {
      setMessage(event.data);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      // Close the socket on error
      socketRef.current?.close();
    };

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (msg: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(msg);
    } else {
      // Queue message if not connected
      messageQueueRef.current.push(msg);
      console.log("Message queued:", msg);
    }
  };

  return {
    message,
    sendMessage,
    isConnected,
    setIsConnected,
    ping,
    countRef,
  };
};

export default useWebSocket;
