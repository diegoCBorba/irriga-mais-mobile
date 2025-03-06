import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getPlants } from "../database/plantsDb";

// Definição do tipo para uma planta
interface Plant {
  id: number;
  nome: string;
  nomeCientifico: string | null;
  umidade: number;
}

// Definição do tipo para o corpo da mensagem WebSocket
interface BodyWSESP {
  id_plant: number;
  humidity_level: number;
}

const WS_URL = "ws://192.168.134.111:81"

export default function SelectPlant() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchPlants = async () => {
      const plantsFromDb = await getPlants();
      setPlants(plantsFromDb);
    };
    fetchPlants();
  }, []);

  // Função para enviar dados via WebSocket
  const sendNewHumidityLevel = (newLevel: number, plantId: number) => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      const jsonMessage = JSON.stringify({
        humidity_level: newLevel,
        id_plant: plantId,
      } as BodyWSESP);
      ws.send(jsonMessage);
      ws.close();
    };
  };

  // Função para selecionar uma planta e enviar os dados via WebSocket
  const handleSelectPlant = (plant: Plant) => {
    sendNewHumidityLevel(plant.umidade, plant.id);
    router.push("/select-plant");
  };

  return (
    <View className="flex-1 bg-white p-6 pt-16">
      <Text className="text-2xl font-bold text-green-700 text-center mb-6">
        Selecione uma Planta
      </Text>
      <ScrollView>
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            onPress={() => handleSelectPlant(plant)}
            className="p-4 border-b border-gray-200"
          >
            <Text className="text-lg font-semibold">{plant.nome}</Text>
            <Text className="text-gray-600">{plant.nomeCientifico}</Text>
            <Text className="text-gray-600">Umidade: {plant.umidade}%</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
