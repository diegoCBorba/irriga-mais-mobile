import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { getPlants, initDb } from "../database/plantsDb"; // Importe as funções do banco de dados
import { useRouter } from "expo-router";
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

export default function Home() {
  const router = useRouter(); // Inicialize o useRouter
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null); // Estado para armazenar a planta selecionada
  const [sensorData, setSensorData] = useState<dataWSEsp>();
  const [isConnected, setIsConnected] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
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
  
  useEffect(() => {

    const ws = new WebSocket(WS_URL); // Substitua pelo IP do ESP32

    ws.onopen = () => {
      console.log("Conectado ao WebSocket");
      setErrorMessage("");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data: dataWSEsp = JSON.parse(event.data);
        if (
          typeof data.humidity === "number" &&
          typeof data.humidity_level === "number" &&
          typeof data.id_plant === "number"
        ) {
          setSensorData(data)
        }
      } catch (error) {
        console.error("Erro ao processar os dados do WebSocket:", error);
        setErrorMessage("Erro inesperado ao enviar dados.");
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("Erro na conexão WebSocket:", error);
      setErrorMessage("Falha ao conectar ao dispositivo.");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (sensorData && plants.length > 0) {
      const foundPlant = plants.find(plant => plant.id === sensorData.id_plant);
      if (foundPlant) {
        setSelectedPlant(foundPlant);
      } else {
        router.push("/select-plant");
      }
    }
  }, [sensorData, plants, router]);

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
          <MaterialIcons name={isConnected? "wifi" : "wifi-off"} size={24} color="black" />
          <Text className="uppercase font-semibold font-baskervville">Status</Text>
          <Text className="uppercase text-green-600 font-baskervville">{isConnected ? "Connected" : "Not Connected"}</Text>
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
                <MaterialIcons name={isConnected ? "block" : "error-outline"} size={84} color="black" />
              </View>
              <View className="w-full items-center mt-4">
                <Text className="text-2xl font-baskervville uppercase text-green-800">
                  {isConnected ? "Selecione uma planta" : "Conectando"}
                </Text>
              </View>
            </>
          )
        }
        </View>

        <View className="items-center mt-4">
          {errorMessage && <Text className="text-red-600">{errorMessage}</Text>}
        </View>
      </View>

      <View className="absolute bottom-0 w-full bg-green-300 py-6 flex-row justify-between px-10">
        <TouchableOpacity disabled={!isConnected} onPress={navigateToAddPlant}>
          <Feather name="plus-circle" size={24} color={isConnected ? "white" : "#136131"} />
        </TouchableOpacity>
        <TouchableOpacity disabled={!isConnected} onPress={navigateToSelectPlant}>
          <MaterialIcons name="save" size={24} color={isConnected ? "white" : "#136131"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}