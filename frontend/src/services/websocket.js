const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";

export function connectWebSocket(onMessage, onError) {
  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error("Invalid WebSocket message:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    if (onError) onError(error);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  return socket;
}