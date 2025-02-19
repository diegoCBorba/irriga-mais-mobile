import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { getPlants, initDb } from "../database/plantsDb"; // Importe as funções do banco de dados
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from '@expo/vector-icons/Feather';

// Defina o tipo para uma planta
interface Plant {
  id: number;
  nome: string;
  nomeCientifico: string | null;
  umidade: number;
}

export default function Home() {
  const router = useRouter(); // Inicialize o useRouter
  const params = useLocalSearchParams();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null); // Estado para armazenar a planta selecionada

  // Busca as plantas ao carregar a tela
  useEffect(() => {
    initDb(); // Inicializa o banco de dados
  }, []);

    // Atualiza a planta selecionada quando os parâmetros da rota mudam
    useEffect(() => {
      if (params.selectedPlant) {
        const plant = JSON.parse(params.selectedPlant as string); // Converte a string de volta para objeto
        setSelectedPlant(plant); // Atualiza a planta selecionada
      }
    }, [params.selectedPlant]);
  

  // Função para navegar para a tela de adicionar plantas
  const navigateToAddPlant = () => {
    router.push("/add-plant"); // Substitua "/add-plant" pelo caminho da sua tela de adicionar plantas
  };

  // Função para navegar para a tela de selecionar plantas
  const navigateToSelectPlant = () => {
    router.push("/select-plant"); // Substitua "/select-plant" pelo caminho da sua tela de selecionar plantas
  };
  

  return (
    <View className="bg-[#F4F1E9] w-full flex-1 items-center pt-16">
      <Text className="uppercase text-center text-3xl text-green-700 font-baskervville">IRRIGA+</Text>

      <View className="w-full items-center justify-center">
        <View className="w-full items-center mt-16">
          <MaterialIcons name="bluetooth-audio" size={24} color="black" />
          <Text className="uppercase font-semibold font-baskervville">Status</Text>
          <Text className="uppercase text-green-600 font-baskervville">Connected</Text>
        </View>

        {/* Seletor de plantas */}
        <View className="w-full items-center my-6">

          {/* Detalhes da planta selecionada */}
          {selectedPlant ? (
            <>
              <View className="w-64 h-64 rounded-full border-8 border-green-700 flex items-center justify-center">
                <Image
                  source={require("../assets/images/icon.png")}
                  className="h-32"
                  resizeMode="contain"
                />
                <Text className="text-xl mt-2">x%</Text>
              </View>
              <View className="w-full items-center mt-4">
                <Text className="text-2xl font-baskervville uppercase text-green-800">
                  {selectedPlant.nome}
                </Text>
                <Text className="text-lg font-baskervville">
                  {selectedPlant.nomeCientifico || "Nome científico não informado"}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View className="w-64 h-64 rounded-full border-8 border-green-700 flex items-center justify-center">
                <MaterialIcons name="block" size={84} color="black" />
              </View>
              <View className="w-full items-center mt-4">
                <Text className="text-2xl font-baskervville uppercase text-green-800">
                  Selecione uma planta
                </Text>
              </View>
            </>
          )
        }
        </View>

        <TouchableOpacity className="mt-6 bg-gray-300 px-6 py-3 rounded-lg flex-row items-center">
          <MaterialIcons name="bluetooth-disabled" size={24} color="black" />
          <Text className="ml-2 uppercase font-semibold">Disconnect</Text>
        </TouchableOpacity>
      </View>

      <View className="absolute bottom-0 w-full bg-green-300 py-6 flex-row justify-between px-10">
        <TouchableOpacity onPress={navigateToAddPlant}>
          <Feather name="plus-circle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToSelectPlant}>
          <MaterialIcons name="save" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}