import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { addPlant } from "../database/plantsDb";

export default function AddPlantScreen() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [nomeCientifico, setNomeCientifico] = useState("");
  const [umidade, setUmidade] = useState("");

  const handleSave = async () => {
    if (!nome || !umidade) {
      Alert.alert("Erro", "Nome e umidade são obrigatórios!");
      return;
    }

    const umidadeValue = parseInt(umidade);
    if (isNaN(umidadeValue) || umidadeValue < 0 || umidadeValue > 100) {
      Alert.alert("Erro", "A umidade deve estar entre 0 e 100.");
      return;
    }

    await addPlant(nome, nomeCientifico, umidadeValue);
    Alert.alert("Sucesso", "Planta adicionada com sucesso!");
    router.push("/"); // Voltar para a tela inicial
  };

  return (
    <View className="flex-1 bg-white p-6 pt-16">
      <Text className="text-2xl font-bold text-green-600 text-center">Adicionar Planta</Text>

      <Text className="mt-4 text-lg">Nome:</Text>
      <TextInput
        className="border border-gray-300 p-2 rounded"
        placeholder="Ex: Alface"
        value={nome}
        onChangeText={setNome}
      />

      <Text className="mt-4 text-lg">Nome Científico (opcional):</Text>
      <TextInput
        className="border border-gray-300 p-2 rounded"
        placeholder="Ex: Lactuca sativa"
        value={nomeCientifico}
        onChangeText={setNomeCientifico}
      />

      <Text className="mt-4 text-lg">Umidade (% para irrigação):</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-6 rounded"
        placeholder="Ex: 40"
        keyboardType="numeric"
        value={umidade}
        onChangeText={setUmidade}
      />

      <Button title="Salvar" onPress={handleSave} color="#2d6a4f" />
    </View>
  );
}
