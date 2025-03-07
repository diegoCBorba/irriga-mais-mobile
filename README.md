# Irriga+

O **Irriga+** é um aplicativo móvel que se comunica com um dispositivo de irrigação automática baseado em ESP32 via Wi-Fi. O app permite ao usuário monitorar o nível de umidade do solo e ajustar os presets de irrigação de acordo com o tipo de planta que está sendo cultivada, com atualizações em tempo real via WebSocket.

---

## Funcionalidades Principais

1. **Monitoramento de Umidade**:
   - Exibe o nível de umidade do solo em tempo real.
   - Permite visualizar a umidade ideal para a planta selecionada.

2. **Seleção de Plantas**:
   - Oferece uma lista de plantas predefinidas com suas respectivas necessidades de umidade.
   - Permite ao usuário selecionar a planta que está sendo cultivada.

3. **Controle de Irrigação**:
   - Envia comandos via Wi-Fi para o dispositivo ESP32 ajustar a irrigação com base no tipo de planta selecionada.
   - Permite alternar entre diferentes presets de irrigação.

4. **Banco de Dados Local**:
   - Armazena informações sobre as plantas (nome, nome científico, umidade ideal) usando SQLite.
   - Permite adicionar, remover e editar plantas.

5. **Interface Intuitiva**:
   - Design moderno e fácil de usar, com navegação simples entre telas.

---

## Tecnologias Utilizadas

### Frontend (Aplicativo)
- **React Native**: Framework para desenvolvimento de aplicativos móveis.
- **Expo**: Plataforma para desenvolvimento e build de aplicativos React Native.
- **Expo Router**: Roteamento para navegação entre telas.
- **NativeWind**: Biblioteca para estilização com Tailwind CSS no React Native.
- **Expo SQLite**: Para armazenamento local de dados das plantas.
- **React Native WebSocket**: Para comunicação em tempo real com o dispositivo ESP32.

### Backend (Dispositivo ESP32)
- **ESP32**: Microcontrolador para controle do sistema de irrigação.
- **Wi-Fi**: Comunicação sem fio com o aplicativo móvel.
- **Sensor de Umidade do Solo**: Para medir a umidade do solo em tempo real.
- **Relé**: Para controlar a ativação da bomba d'água.
- **Bomba d'água**: Dispositivo utilizado para regar as plantas.

---

## Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- Expo CLI (`npm install -g expo-cli`)
- Dispositivo móvel com o app Expo Go instalado (para testes em desenvolvimento).

### Passos para Executar

1. Clone o repositório:
   ```bash
   git@github.com:diegoCBorba/irriga-mais-mobile.git
   cd irriga-mais
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

4. Escaneie o QR code com o app Expo Go (disponível na App Store ou Google Play) para abrir o aplicativo no seu dispositivo.

5. Para testar em um emulador Android/iOS:
   ```bash
   npm run android  # Para Android
   npm run ios      # Para iOS
   ```
