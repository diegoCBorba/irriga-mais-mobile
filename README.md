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

## Telas Implementadas  

### **Tela de Conexão Wi-Fi**  

- Essa tela gerencia a conexão com o ESP32 via WebSocket. As funcionalidades do aplicativo só serão habilitadas após uma conexão bem-sucedida.  
- O usuário recebe feedback visual sobre o processo de conexão por meio de ícones e mensagens exibidas no centro da tela.  

![Imagem](https://github.com/user-attachments/assets/49e24c1b-098f-4824-8d04-eca43f72315a)  

### **Tela Inicial**  

- Se o ESP32 não enviar uma resposta JSON com um ID de planta previamente configurado, o usuário será redirecionado para a tela de seleção de planta. Caso contrário, a tela inicial será carregada.  
- Informações exibidas na tela:  
  - Status da conexão com o ESP32  
  - Porcentagem de umidade atual da planta  
  - Nome da planta, nome científico e nível de umidade necessário para ativação da irrigação  
- A barra de navegação na parte inferior oferece acesso às telas de adição de plantas, relatório e seleção de plantas.  

![Imagem](https://github.com/user-attachments/assets/cc03370f-7587-4813-a94b-cb885018b6b8)  

### **Tela de Adição de Planta**  

- Nesta tela, o usuário pode cadastrar novas plantas, que serão armazenadas no banco de dados local (SQLite).  
- O formulário contém os seguintes campos:  
  - **Nome** e **nível de umidade** (campos obrigatórios)  
  - **Nome científico** (opcional)  

### **Tela de Relatório**  

- Apresenta um gráfico com as variações de umidade ao longo do tempo.  
- O usuário pode alternar a escala de tempo entre **últimas 24 horas, última semana e último mês**.  
- São exibidos os seguintes indicadores:  
  - **Média de umidade**  
  - **Umidade mínima e máxima registradas**  
  - **Última medição de umidade**  

![Imagem](https://github.com/user-attachments/assets/f4523e91-cabf-4fa4-9490-3fbf2dedd6b7)  

### **Tela de Seleção de Planta**  

- Exibe uma lista de todas as plantas cadastradas.  
- O usuário pode selecionar uma planta para configurá-la no ESP32.  

![Imagem](https://github.com/user-attachments/assets/58fb4742-6e3c-4ff0-b88f-feffed83e61d)  

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

## Hardware (ESP32)

O hardware do sistema de irrigação automática é baseado no ESP32 e é responsável por coletar dados do sensor de umidade do solo, controlar o motor de irrigação e se comunicar com o aplicativo móvel via WebSocket.

### Repositório do Código do ESP32

O código-fonte do firmware do ESP32 está disponível no seguinte repositório:

🔗 **[Repositório do ESP32](https://github.com/diegoCBorba/irriga-mais-esp32)**
