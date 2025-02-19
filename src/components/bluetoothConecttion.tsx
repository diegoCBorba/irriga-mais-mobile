import { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import BluetoothSerial from "react-native-bluetooth-serial-next";

export default function BluetoothConnection() {
  const [devices, setDevices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [moisture, setMoisture] = useState("0%");

  useEffect(() => {
    async function loadDevices() {
      try {
        // Solicita permissão no Android
        await BluetoothSerial.requestEnable();
        
        // Lista os dispositivos pareados
        const pairedDevices = await BluetoothSerial.list();
        setDevices(pairedDevices);
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
      }
    }

    loadDevices();
  }, []);

  // Função para conectar ao HC-05
  async function connectToDevice(device) {
    try {
      await BluetoothSerial.connect(device.id);
      setIsConnected(true);
      console.log(`Conectado a: ${device.name}`);

      // Começa a ler os dados do sensor
      BluetoothSerial.withDelimiter("\n").then(() => {
        BluetoothSerial.on("read", (data) => {
          console.log("Dados recebidos:", data);
          setMoisture(`${data.data.trim()}%`);
        });
      });
    } catch (error) {
      console.error("Erro ao conectar:", error);
    }
  }

  // Função para desconectar
  async function disconnect() {
    await BluetoothSerial.disconnect();
    setIsConnected(false);
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold">Conexão Bluetooth</Text>

      {isConnected ? (
        <View>
          <Text>Status: ✅ Conectado</Text>
          <Text>Umidade do solo: {moisture}</Text>
          <Button title="Desconectar" onPress={disconnect} />
        </View>
      ) : (
        <ScrollView>
          <Text>Dispositivos Pareados:</Text>
          {devices.map((device) => (
            <Button
              key={device.id}
              title={`Conectar a: ${device.name}`}
              onPress={() => connectToDevice(device)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
