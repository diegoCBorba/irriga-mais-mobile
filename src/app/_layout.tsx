import "../styles/global.css";

import { Stack } from "expo-router"; // Importe o Stack
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Loading } from "../components/loading";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "Baskervville-SC": require("../assets/fonts/BaskervvilleSC-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <Loading />; // Exibe o componente de carregamento enquanto as fontes não são carregadas
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false, // Remove o header de todas as telas
        }}
      >
        {/* Tela inicial */}
        <Stack.Screen
          name="index" // Nome do arquivo da tela (app/index.tsx)
          options={{
            title: "Home", // Título da tela (não será exibido, pois o header está oculto)
          }}
        />

        {/* Tela de adicionar planta */}
        <Stack.Screen
          name="add-plant" // Nome do arquivo da tela (app/add-plant.tsx)
          options={{
            title: "Adicionar Planta", // Título da tela (não será exibido, pois o header está oculto)
          }}
        />

        {/* Tela de selecionar planta */}
        <Stack.Screen
          name="select-plant" // Nome do arquivo da tela (app/select-plant.tsx)
          options={{
            title: "Selecionar Planta", // Título da tela (não será exibido, pois o header está oculto)
          }}
        />
      </Stack>
    </>
  );
}