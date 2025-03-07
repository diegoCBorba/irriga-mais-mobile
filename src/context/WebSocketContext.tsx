import React, { createContext, useContext, useEffect, useState } from "react";

interface WebSocketContextType {
  sensorData: dataWSEsp | null;
  isConnected: boolean;
  sendNewHumidityLevel: (newLevel: number, plantId: number) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface dataWSEsp {
  humidity: number;
  id_plant: number;
  humidity_level: number;
  message: string;
}

// Definição do tipo para o corpo da mensagem WebSocket
interface BodyWSESP {
  id_plant: number;
  humidity_level: number;
}

const WS_URL = "ws://192.168.134.111:81";

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [sensorData, setSensorData] = useState<dataWSEsp | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log("Conectado ao WebSocket");
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      try {
        const data: dataWSEsp = JSON.parse(event.data);
        if (
          typeof data.humidity === "number" &&
          typeof data.humidity_level === "number" &&
          typeof data.id_plant === "number"
        ) {
          setSensorData(data);
        }
      } catch (error) {
        console.error("Erro ao processar os dados do WebSocket:", error);
      }
    };

    websocket.onclose = () => {
      console.log("Desconectado do WebSocket");
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error("Erro na conexão WebSocket:", error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendNewHumidityLevel = (newLevel: number, plantId: number) => {
    if (ws && isConnected) {
      const jsonMessage = JSON.stringify({
        humidity_level: newLevel,
        id_plant: plantId,
      } as BodyWSESP);
      ws.send(jsonMessage);
    } else {
      console.error("WebSocket não está conectado.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ sensorData, isConnected, sendNewHumidityLevel }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook para usar o WebSocketContext
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket deve ser usado dentro de um WebSocketProvider");
  }
  return context;
};
