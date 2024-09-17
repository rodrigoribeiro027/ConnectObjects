# Projeto de Conexão de Objetos com Angular e [Konva.js](https://konvajs.org/index.html)

Este projeto é uma aplicação web construída com Angular e Konva.js que permite ao usuário conectar objetos (como retângulos e círculos) em uma área de desenho, visualizando as conexões entre eles de forma interativa. Além disso, o projeto inclui uma interface de visualização que permite salvar e recuperar essas conexões a partir de um backend simulado.

## 🌟 Funcionalidades Principais

- **Conexão de Objetos**: Permite ao usuário arrastar e conectar objetos (retângulos e círculos) dentro de um canvas, criando uma visualização clara e interativa das relações entre os objetos.
- **Limitação de Movimentos**: As formas só podem ser movidas dentro dos limites do canvas, garantindo que os objetos permaneçam sempre visíveis.
- **Persistência de Dados**: As posições dos objetos e suas conexões são armazenadas e podem ser enviadas para um backend simulado, garantindo que as conexões sejam recuperáveis e consistentes.
- **Visualização Precisa**: A interface de visualização permite que as conexões salvas sejam exibidas com precisão, simulando um fluxo de dados real de backend.

## 🎨 Captura de Tela

![Exemplo do Projeto de Conexão de Objetos com Angular e Konva.js](https://github.com/rodrigoribeiro027/ConnectObjects/blob/main/src/assets/transformObjects.png)


![Teste vindo com Coordenadas Especificas Da Imagem](https://github.com/rodrigoribeiro027/ConnectObjects/blob/main/src/assets/Testback.png)

### 📄 Relatorio Gerado por PDF e Imagem

[Relatorio](https://github.com/rodrigoribeiro027/ConnectObjects/blob/main/src/assets/Relatório.pdf)

## 🛠️ Tecnologias Utilizadas

- **Angular**: Framework robusto para a construção de interfaces web dinâmicas e responsivas.
- **Konva.js**: Biblioteca poderosa para manipulação de gráficos em `canvas` HTML5, facilitando a criação de formas, textos e interatividade avançada.

## 🗂️ Estrutura do Projeto

### HomePage Component

- **Canvas e Objetos**: A lógica para criação, movimentação e conexão de objetos (retângulos e círculos) no canvas é gerenciada dentro deste componente.
- **Detalhes dos Objetos**: O componente também atualiza e exibe os detalhes dos objetos, como suas posições, IDs únicos e mensagens associadas.
- **Interatividade com Konva.js**: Toda a interatividade gráfica, incluindo o desenho de linhas entre os objetos e a limitação de movimentos dentro do canvas, é implementada no `ngAfterViewInit` do componente `HomePage`.

## 🚀 Como Usar

### Conectar Objetos:

1. Arraste os objetos (retângulos e círculos) dentro do canvas.
2. As conexões são automaticamente atualizadas ao mover os objetos.
3. Clique em "Confirmar" para salvar as posições e conexões.

### Visualizar Conexões:

As conexões salvas são exibidas no **ConnectionViewerComponent**, que simula a integração com um backend, proporcionando uma experiência realista de visualização.

## Instalação

**Clone o repositório:**

   ```bash
   git clone https://github.com/rodrigoribeiro027/ConnectObjects.git
```

**Instale as dependências:**

**Navegue até o diretório do projeto e execute:**
  ```bash
    npm install
  ```
**Execute a aplicação:**

```bash
    ng serve
```

## Acesse a aplicação no navegador em http://localhost:4200.
