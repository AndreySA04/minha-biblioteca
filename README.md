# 📚 Minha Biblioteca

Uma aplicação mobile moderna e elegante desenvolvida em **React Native** e **Expo** para gerenciamento de leitura pessoal.  
Acompanhe seus livros, defina status de leitura, dê notas aos seus favoritos e personalize sua estante com capas salvas diretamente no seu dispositivo.

---

## ✨ Principais Funcionalidades

- **Gestão de Acervo (CRUD):**  
  Adicione, edite, visualize e exclua livros com facilidade.

- **Controle de Status:**  
  Categorize suas leituras entre *Quero Ler*, *Lendo* e *Lidos*.

- **Avaliação de Leituras:**  
  Sistema de classificação por estrelas exclusivo para livros finalizados.

- **Capas Personalizadas:**  
  Suporte a upload de imagens da galeria com salvamento local permanente e otimizado usando as novas APIs do FileSystem (SDK 51+).

- **Filtros Rápidos:**  
  Navegue facilmente entre as categorias através de uma barra superior responsiva.

- **Ordenação Inteligente:**  
  Organize sua lista por *Adicionados Recentemente*, *Ordem Alfabética* ou *Melhor Avaliação* através de um Action Sheet fluido.

- **Modo Escuro (Dark Mode):**  
  Suporte nativo e automático ao tema do dispositivo, com paletas de cores otimizadas para descanso visual (*slate-900* e *slate-950*).

- **Feedback Visual:**  
  Notificações não-intrusivas (*Toasts customizados*) para ações de sucesso ou erro.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído focado em alta performance e manutenibilidade, utilizando as ferramentas mais recentes do ecossistema:

- **Framework:** React Native com Expo (SDK 51/52)  
- **Roteamento:** Expo Router (File-based routing)  
- **Estilização:** NativeWind v4 (Tailwind CSS nativo)  
- **Banco de Dados:** Expo SQLite (Armazenamento local off-line)  
- **Gestão de Arquivos:** expo-file-system e expo-image-picker (APIs baseadas em JSI/C++)  
- **Ícones:** Lucide React Native  
- **UI/UX Extras:** expo-linear-gradient e react-native-toast-message  

---

## 🏗️ Padrões de Arquitetura

O projeto adota a **Separação de Responsabilidades (SoC - Separation of Concerns):**

- **UI Components:**  
  Telas e componentes puramente visuais e "burros" (ex: `BookItem`, `FilterBar`).

- **Custom Hooks:**  
  Toda a lógica de negócio, ordenação e filtragem em memória está encapsulada (ex: `useBooks`).

- **Repository Pattern:**  
  As interações diretas com o banco de dados SQLite são isoladas na camada de repositório.

---

## 📂 Estrutura do Projeto
```
minha-biblioteca/
├── app/
│ ├── _layout.tsx                 # Configuração de temas, Toasts e navegação global
│ ├── index.tsx                   # Tela principal (Lista de Livros, Filtros e Ordenação)
│ └── form.tsx                    # Tela de formulário (Criação, Edição e Upload de Capa)
├── src/
│ ├── components/                 # Componentes reutilizáveis
│ │ ├── BookItem.tsx              # Card do livro na listagem
│ │ ├── FilterBar.tsx             # Barra de abas de status
│ │ └── EmptyState.tsx            # Telas de estado vazio amigáveis
│ ├── hooks/
│ │ └── useBooks.ts               # Gerenciamento de estado, filtros e regras de negócio
│ ├── database/
│ │ └── repository.ts             # Operações CRUD diretas com o SQLite
│ └── types/
│ └── book.ts                     # Definições de interfaces e tipos do TypeScript
├── global.css                    # Injeção de dependências do Tailwind/NativeWind
├── tailwind.config.js            # Configuração de design system e presets
├── babel.config.js               # Configurações do compilador
└── package.json
```

---

## 💻 Como Executar o Projeto

Siga os passos abaixo para rodar o aplicativo no seu ambiente local de desenvolvimento.

### Pré-requisitos

- Node.js instalado  
- Aplicativo **Expo Go** instalado no seu celular (iOS ou Android), ou um emulador configurado na sua máquina  

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/minha-biblioteca.git
```

2. Acesse a pasta do projeto:

```bash
cd minha-biblioteca
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor de desenvolvimento limpando o cache (recomendado para o NativeWind v4):

```bash
npx expo start -c
```

5. Escaneie o QR Code gerado no terminal usando a câmera do seu iPhone ou o aplicativo Expo Go no Android.

Desenvolvido com dedicação e boas práticas de engenharia de software. 🚀
