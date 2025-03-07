import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { getReports } from "../database/plantsDb";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";

interface Report {
  id: number;
  id_plant: number;
  humidity: number;
  timestamp: string;
}

export default function Report() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "semanal" | "mensal">("24h");

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const mockData: Report[] = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      id_plant: 101 + (index % 3),
      humidity: Math.floor(Math.random() * (70 - 30 + 1)) + 30,
      timestamp: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
    }));

    setReports(mockData);
  };

  const filterReportsByPeriod = (period: "24h" | "semanal" | "mensal") => {
    const now = new Date();
    let filteredReports = [];

    switch (period) {
      case "24h":
        filteredReports = reports.filter(
          (report) => new Date(report.timestamp) >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
        );
        break;
      case "semanal":
        filteredReports = reports.filter(
          (report) => new Date(report.timestamp) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        );
        break;
      case "mensal":
        filteredReports = reports.filter(
          (report) => new Date(report.timestamp) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        );
        break;
    }

    return filteredReports;
  };

  const getChartData = (period: "24h" | "semanal" | "mensal") => {
    const filteredReports = filterReportsByPeriod(period);

    return {
      labels: filteredReports.map((report) => new Date(report.timestamp).toLocaleTimeString()),
      datasets: [
        {
          data: filteredReports.map((report) => report.humidity),
          strokeWidth: 2,
          color: (opacity = 1) => `rgba(34, 193, 195, ${opacity})`,
        },
      ],
    };
  };

  const calculateStatistics = (period: "24h" | "semanal" | "mensal") => {
    const filteredReports = filterReportsByPeriod(period);
    if (filteredReports.length === 0) return { avg: 0, min: 0, max: 0, last: 0 };

    const humidities = filteredReports.map((report) => report.humidity);
    const avg = humidities.reduce((acc, curr) => acc + curr, 0) / humidities.length;
    const min = Math.min(...humidities);
    const max = Math.max(...humidities);
    const last = humidities[humidities.length - 1];

    return { avg, min, max, last };
  };

  const { avg, min, max, last } = calculateStatistics(selectedPeriod);


  return (
    <View className="flex-1 items-center bg-[#F4F1E9] pt-16">
      <Text className="text-3xl text-green-700 text-center font-baskervville uppercase mb-4">Relatório</Text>
      
      <View className="bg-white rounded-lg border border-gray-300 px-1 my-4 w-56">
        <Picker
          selectedValue={selectedPeriod}
          onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
          className="text-gray-700"
          dropdownIconColor="#333"
        >
          <Picker.Item label="Últimas 24h" value="24h" />
          <Picker.Item label="Semanal" value="semanal" />
          <Picker.Item label="Mensal" value="mensal" />
        </Picker>
      </View>
      {reports.length > 0 ? (
        <LineChart
          data={getChartData(selectedPeriod)}
          width={screenWidth - 20}
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          withInnerLines={false}
          withVerticalLabels={false}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
        />
      ) : (
        <Text className="text-center text-gray-500 mt-6">Nenhum relatório disponível.</Text>
      )}

      <View className="bg-white rounded-lg border border-gray-300 p-4 w-11/12 mx-4 my-2">
        <Text className="text-lg font-bold text-gray-700">Média de Umidade: {avg.toFixed(1)}%</Text>
        <Text className="text-lg font-bold text-gray-700">Mínima: {min}%</Text>
        <Text className="text-lg font-bold text-gray-700">Máxima: {max}%</Text>
        <Text className="text-lg font-bold text-gray-700">Última Medição: {last}%</Text>
      </View>
    </View>
  );
}
