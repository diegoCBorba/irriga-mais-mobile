import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { addReport, getPlantById, initDb } from "../database/plantsDb";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from '@expo/vector-icons/Feather';
import { useWebSocket } from "../context/WebSocketContext";
import { Snackbar } from "react-native-paper";

interface Plant {
  id: number;
  nome: string;
  nomeCientifico: string | null;
  umidade: number;
}

export default function Home() {
  const router = useRouter();
  const { isConnected, sensorData } = useWebSocket();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [lastInsertedHumidity, setLastInsertedHumidity] = useState<number | null>(null);

  // Inicializa o banco de dados ao montar o componente
  useEffect(() => {
    initDb();
  }, []);

  // Verifica se a planta do sensor existe no banco de dados
  useEffect(() => {
    if (sensorData) {
      const checkPlant = async () => {
        const foundPlant = await getPlantById(sensorData.id_plant); // Busca a planta pelo ID
        if (foundPlant) {
          setSelectedPlant(foundPlant); // Define a planta selecionada
        } else {
          router.push("/select-plant"); // Redireciona para a tela de seleção de plantas se a planta não for encontrada
        }
      };
      checkPlant();
    }

    // Exibe uma mensagem no Snackbar se houver uma mensagem no sensorData
    if (sensorData?.message && sensorData.message !== snackbarMessage) {
      setSnackbarMessage(sensorData.message);
      setSnackbarVisible(true);
    }
  }, [sensorData, router]);

  // Insere um relatório no banco de dados se a umidade mudar significativamente
  useEffect(() => {
    if (sensorData && selectedPlant) {
      const filteredHumidity = Number(sensorData.humidity.toFixed(0)); // Arredonda a umidade para um número inteiro
      const threshold = 5; // Define um limiar de 5% para evitar inserções desnecessárias

      // Verifica se a diferença entre a umidade atual e a última inserida é maior que o limiar
      if (
        lastInsertedHumidity === null ||
        Math.abs(filteredHumidity - lastInsertedHumidity) >= threshold
      ) {
        addReport(filteredHumidity, selectedPlant.id) // Adiciona o relatório ao banco de dados
          .then(() => setLastInsertedHumidity(filteredHumidity)) // Atualiza a última umidade inserida
          .catch((err) => console.error("Erro ao inserir relatório:", err)); // Trata erros
      }
    }
  }, [sensorData, selectedPlant]);

  // Função para navegar para a tela de adicionar plantas
  const navigateToAddPlant = () => {
    router.push("/add-plant");
  };

  // Função para navegar para a tela de relatórios
  const navigateToReport = () => {
    router.push("/report");
  };

  // Função para navegar para a tela de selecionar plantas
  const navigateToSelectPlant = () => {
    router.push("/select-plant");
  };

  // Renderização do componente
  return (
    <View className="bg-[#F4F1E9] w-full flex-1 items-center pt-16">
      <Text className="uppercase text-center text-3xl text-green-700 font-baskervville">IRRIGA+</Text>

      <View className="w-full items-center justify-center">
        <View className="w-full items-center mt-16">
          <MaterialIcons name={isConnected ? "wifi" : "wifi-off"} size={24} color="black" />
          <Text className="uppercase font-semibold font-baskervville">Status</Text>
          <Text className="uppercase text-green-600 font-baskervville">{isConnected ? "Connected" : "Not Connected"}</Text>
        </View>

        <View className="w-full items-center my-6">
          {isConnected && selectedPlant ? (
            <>
              <View className="w-64 h-64 rounded-full border-8 border-green-700 flex items-center justify-center">
                <Image
                  source={require("../assets/images/icon.png")}
                  className="h-32"
                  resizeMode="contain"
                />
                <Text className="text-xl mt-2">
                  {sensorData ? `${(sensorData.humidity > 100 ? "100" : sensorData.humidity.toFixed(0))}%` : "N/A"}
                </Text>
              </View>
              <View className="w-full items-center mt-4">
                <Text className="text-2xl font-baskervville uppercase text-green-800">
                  {selectedPlant.nome}
                </Text>
                <Text className="text-lg font-baskervville">
                  {selectedPlant.nomeCientifico || "Nome científico não informado"}
                </Text>
                <Text className="text-sm font-baskervville">
                  {`Umidade máxima: ${selectedPlant.umidade}%` || "Humidade máxima não informada"}
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
          )}
        </View>
      </View>

      <View className="absolute bottom-0 w-full bg-green-300 py-6 flex-row justify-between px-10">
        <TouchableOpacity disabled={!isConnected} onPress={navigateToAddPlant}>
          <Feather name="plus-circle" size={24} color={isConnected ? "white" : "#136131"} />
        </TouchableOpacity>
        <TouchableOpacity disabled={!isConnected} onPress={navigateToReport}>
          <MaterialIcons name="align-vertical-bottom" size={24} color={isConnected ? "white" : "#136131"} />
        </TouchableOpacity>
        <TouchableOpacity disabled={!isConnected} onPress={navigateToSelectPlant}>
          <MaterialIcons name="save" size={24} color={isConnected ? "white" : "#136131"} />
        </TouchableOpacity>
      </View>

      <Snackbar className="mb-24" visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={5000} action={{ label: "OK" }}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}