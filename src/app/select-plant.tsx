import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getPlants } from "../database/plantsDb";
import { useWebSocket } from "../context/WebSocketContext";

interface Plant {
  id: number;
  nome: string;
  nomeCientifico: string | null;
  umidade: number;
}

export default function SelectPlant() {
  const { sendNewHumidityLevel } = useWebSocket(); // Função para enviar um novo nível de umidade via WebSocket
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]); // Estado para armazenar a lista de plantas

  // Efeito para buscar as plantas do banco de dados ao montar o componente
  useEffect(() => {
    const fetchPlants = async () => {
      const plantsFromDb = await getPlants(); // Busca as plantas do banco de dados
      setPlants(plantsFromDb); // Atualiza o estado com as plantas obtidas
    };
    fetchPlants(); // Executa a função de busca
  }, []);

  // Função para selecionar uma planta e enviar os dados via WebSocket
  const handleSelectPlant = (plant: Plant) => {
    sendNewHumidityLevel(plant.umidade, plant.id); // Envia o nível de umidade e o ID da planta via WebSocket
    router.push("/"); // Navega de volta para a tela inicial
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