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

interface dataWSEsp {
  humidity: number,
  id_plant: number,
  humidity_level: number,
}

interface BodyWSESP{
  id_plant: number,
  humidity_level: number,
}

export default function Home() {
  const router = useRouter(); // Inicialize o useRouter
  const params = useLocalSearchParams();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null); // Estado para armazenar a planta selecionada
  const [sensorData, setSensorData] = useState<dataWSEsp>();
  const [isConnected, setIsConnected] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const WS_URL = "ws://192.168.134.111:81"

  // Inicializa o banco de dados e carrega as plantas ao montar o componente
  useEffect(() => {
    async function loadPlants() {
      initDb(); // Inicializa o banco de dados
      const storedPlants = await getPlants(); // Obtém a lista de plantas do banco
      setPlants(storedPlants);
    }

    loadPlants();
  }, []);

  // Atualiza a planta selecionada quando os parâmetros da rota mudam
  useEffect(() => {
    if (params.selectedPlant) {
      const plant = JSON.parse(params.selectedPlant as string); // Converte a string de volta para objeto
      setSelectedPlant(plant); // Atualiza a planta selecionada
    }
  }, [params.selectedPlant]);
  
  useEffect(() => {

    const ws = new WebSocket(WS_URL); // Substitua pelo IP do ESP32

    ws.onopen = () => {
      console.log("Conectado ao WebSocket");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data: dataWSEsp = JSON.parse(event.data);
        console.log("Dados recebidos:", data);

        setSensorData(data)

        // if (
        //   typeof data.humidity === "number" &&
        //   typeof data.humidity_level === "number" &&
        //   typeof data.id_plant === "number"
        // ) {
        //   setSensorData(data)
        // }
      } catch (error) {
        console.error("Erro ao processar os dados do WebSocket:", error);
      }
    };

    ws.onclose = () => {
      console.log("Desconectado do WebSocket");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("Erro na conexão WebSocket:", error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendNewHumidityLevel = (newLevel: number, plantId: number) => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      const jsonMessage = JSON.stringify({ humidity_level: newLevel, id_plant: plantId });
      ws.send(jsonMessage);
      ws.close();
    };
  };

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
          {isConnected && selectedPlant ? (
            <>
              <View className="w-64 h-64 rounded-full border-8 border-green-700 flex items-center justify-center">
                <Image
                  source={require("../assets/images/icon.png")}
                  className="h-32"
                  resizeMode="contain"
                />
                <Text className="text-xl mt-2">{sensorData ? `${sensorData.humidity}%` : "N/A"}</Text>
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

        <TouchableOpacity 
          className="mt-6 bg-gray-300 px-6 py-3 rounded-lg flex-row items-center"
          onPress={() => sendNewHumidityLevel(60, 2)}
        >
          <Text className="ml-2 uppercase font-semibold">CLIQUE TESTE</Text>
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