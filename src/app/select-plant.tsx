import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getPlants } from "../database/plantsDb"; // Importe a função getPlants

// Defina o tipo para uma planta
interface Plant {
  id: number;
  nome: string;
  nomeCientifico: string | null;
  umidade: number;
}

export default function SelectPlant() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]); // Estado para armazenar a lista de plantas

  // Busca as plantas do banco de dados ao carregar a tela
  useEffect(() => {
    const fetchPlants = async () => {
      const plantsFromDb = await getPlants(); // Busca as plantas do banco de dados
      setPlants(plantsFromDb); // Atualiza o estado com as plantas obtidas
    };

    fetchPlants();
  }, []);

  // Função para selecionar uma planta
  const handleSelectPlant = (plant: Plant) => {
    // Navega de volta para a tela principal e passa a planta selecionada como parâmetro
    router.push({
      pathname: "/",
      params: { selectedPlant: JSON.stringify(plant) }, // Passa a planta como string
    });
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