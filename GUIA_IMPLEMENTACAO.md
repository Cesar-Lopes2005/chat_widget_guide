# Guia de Implementação - Widget de Chat com IA

Este guia fornece instruções detalhadas para implementar o widget de chat em qualquer aplicação React/TypeScript.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Estrutura do Widget](#estrutura-do-widget)
3. [Instalação de Dependências](#instalação-de-dependências)
4. [Implementação Passo a Passo](#implementação-passo-a-passo)
5. [Personalização](#personalização)
6. [Integração com Backend](#integração-com-backend)
7. [Exemplos de Uso](#exemplos-de-uso)

---

## 🔧 Pré-requisitos

- **React** 18+
- **TypeScript** 5+
- **Node.js** 16+
- **Biblioteca de UI**: shadcn/ui (opcional, mas recomendado)
- **Lucide React**: Para ícones

---

## 🏗️ Estrutura do Widget

O widget é composto por:

```
src/
├── components/
│   ├── ChatWidget.tsx          # Componente principal do widget
│   └── ui/                     # Componentes UI (Button, Input)
├── lib/
│   └── utils.ts                # Utilitários (função cn para classes)
└── pages/
    └── Index.tsx               # Página principal com integração
```

---

## 📦 Instalação de Dependências

### Instale as dependências básicas:

```bash
npm install lucide-react clsx tailwind-merge
```

### Se estiver usando shadcn/ui:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input
```

### Configuração do Tailwind CSS (se não estiver configurado):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 🚀 Implementação Passo a Passo

### **Passo 1: Criar o arquivo de utilitários**

Crie o arquivo `src/lib/utils.ts` com o código disponível em: [`codigos/utils.ts`](codigos/utils.ts)

Este arquivo contém a função `cn()` que é usada para combinar classes CSS do Tailwind de forma inteligente.

### **Passo 2: Criar os componentes UI básicos**

Se não estiver usando shadcn/ui, crie os componentes básicos:

- **Button**: Use o código disponível em [`codigos/button.tsx`](codigos/button.tsx)
- **Input**: Use o código disponível em [`codigos/input.tsx`](codigos/input.tsx)

Coloque estes arquivos em `src/components/ui/`

### **Passo 3: Criar o componente ChatWidget**

Copie o código do arquivo [`codigos/ChatWidget.tsx`](codigos/ChatWidget.tsx) para `src/components/ChatWidget.tsx`

**⚠️ IMPORTANTE**: Personalize as seguintes constantes no início do arquivo:
- `WEBHOOK_URL`: URL do seu backend/webhook
- `WHATSAPP_NUMBER`: Seu número de WhatsApp (formato internacional)
- `WHATSAPP_MESSAGE`: Mensagem padrão do WhatsApp
- `BOT_NAME`: Nome do seu assistente
- `WELCOME_MESSAGE`: Mensagem de boas-vindas

### **Passo 4: Integrar o Widget em sua página**

Use o exemplo de integração disponível em [`codigos/App.tsx`](codigos/App.tsx) para integrar o widget em sua aplicação.

O widget pode ser aberto de duas formas:
1. **Clique no botão flutuante**: O usuário clica no ícone fixo no canto da tela
2. **Programaticamente**: Chame `handleChatOpen()` com uma mensagem inicial opcional

---

## 🎨 Personalização

### **Aspectos Personalizáveis no ChatWidget.tsx:**

| Variável/Seção | Descrição | Onde encontrar |
|----------------|-----------|----------------|
| `WEBHOOK_URL` | URL do seu backend/webhook para processar mensagens | Constantes no início do arquivo |
| `WHATSAPP_NUMBER` | Número do WhatsApp (formato internacional sem +) | Constantes no início do arquivo |
| `WHATSAPP_MESSAGE` | Mensagem padrão ao abrir WhatsApp | Constantes no início do arquivo |
| `BOT_NAME` | Nome exibido no cabeçalho do chat | Constantes no início do arquivo |
| `WELCOME_MESSAGE` | Mensagem de boas-vindas ao abrir o chat | Constantes no início do arquivo |
| `quickQuestions` | Perguntas sugeridas exibidas inicialmente | Array dentro do componente |
| `getDefaultResponse()` | Respostas automáticas baseadas em palavras-chave | Função dentro do componente |
| **Cores** | Classes Tailwind como `bg-blue-600`, `text-blue-600` | Ao longo do JSX |
| **Posição** | `fixed bottom-6 right-6` - posição do widget | No return do componente |
| **Tamanho** | `w-96` (largura), `h-96` (altura do chat) | No return do componente |

### **Exemplo de Personalização de Cores:**

Para mudar a cor principal de azul para roxo, busque e substitua no arquivo:
- `bg-blue-600` → `bg-purple-600`
- `text-blue-600` → `text-purple-600`
- `hover:bg-blue-700` → `hover:bg-purple-700`
- `from-blue-50 to-blue-100` → `from-purple-50 to-purple-100`

### **Personalizando Perguntas Rápidas:**

Edite o array `quickQuestions` para incluir perguntas relevantes ao seu negócio:

```typescript
const quickQuestions = [
  "Qual o horário de atendimento?",
  "Onde fica a loja?",
  "Quais formas de pagamento?",
  "Tem delivery?"
];
```

### **Personalizando Respostas Automáticas:**

Edite a função `getDefaultResponse()` para adicionar suas próprias palavras-chave e respostas:

```typescript
if (lowerMessage.includes('horário') || lowerMessage.includes('funcionamento')) {
  return 'Funcionamos de segunda a sexta, das 9h às 18h! 🕐';
}
```

---

## 🔌 Integração com Backend (Opcional)

> **⚠️ IMPORTANTE**: O widget funciona **100% no frontend** sem necessidade de backend. Ele usa a função `getDefaultResponse()` para fornecer respostas automáticas baseadas em palavras-chave.

### **Modo de Operação:**

#### **1. Sem Backend (Implementação Atual)**
- O widget funciona totalmente no frontend
- Respostas são geradas pela função `getDefaultResponse()` no arquivo `ChatWidget.tsx`
- Ideal para:
  - Landing pages simples
  - FAQs automatizados
  - Prototipagem rápida
  - Redirecionamento para WhatsApp

#### **2. Com Backend (Opcional)**
- Permite integração com IA (OpenAI, Claude, etc)
- Conexão com banco de dados
- Lógica de negócio complexa
- Histórico centralizado de conversas

### **Como Funciona Sem Backend:**

No arquivo `ChatWidget.tsx`, a função `getDefaultResponse()` analisa a mensagem do usuário e retorna respostas pré-programadas:

```typescript
const getDefaultResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('reunião')) {
    return 'Vou conectar você com nossa equipe!';
  }

  if (lowerMessage.includes('preço')) {
    return 'Nossos planos começam em R$ 99/mês!';
  }

  return 'Nossa equipe pode ajudar melhor. Fale no WhatsApp!';
};
```

**Personalize esta função** para adicionar suas próprias respostas!

---

### **Se Quiser Adicionar Backend:**

#### **Estrutura da Requisição enviada ao WEBHOOK_URL:**

```json
{
  "message": "string",      // Mensagem do usuário
  "sessionId": "string",    // ID único da sessão
  "timestamp": "string"     // ISO 8601 timestamp
}
```

#### **Estrutura esperada da Resposta:**

O widget aceita diversos formatos de resposta:

**Opção 1 - Resposta simples:**
```json
{
  "response": "Texto da resposta do bot"
}
```

**Opção 2 - Resposta com estrutura:**
```json
{
  "output": {
    "response": "Texto da resposta do bot"
  }
}
```

**Opção 3 - Texto puro:**
```
Texto da resposta do bot
```

#### **Exemplos de Backend:**

Consulte os exemplos de implementação de backend:
- **Node.js/Express**: [`codigos/backend-nodejs.js`](codigos/backend-nodejs.js)
- **Python/Flask**: [`codigos/backend-python.py`](codigos/backend-python.py)

#### **Configuração de CORS:**

Se seu frontend e backend estiverem em domínios diferentes, você precisará configurar CORS no backend. Exemplos incluídos nos arquivos de backend acima.

---

## 📝 Exemplos de Uso

### **Exemplo 1: Abrir chat com mensagem pré-definida**

```typescript
<button onClick={() => handleChatOpen("Quero agendar uma reunião")}>
  Agendar Reunião
</button>
```

### **Exemplo 2: Integrar com página de produtos**

Veja o exemplo completo em: [`codigos/exemplo-produto.tsx`](codigos/exemplo-produto.tsx)

### **Exemplo 3: Múltiplos idiomas**

Veja o exemplo completo em: [`codigos/exemplo-multilingual.tsx`](codigos/exemplo-multilingual.tsx)

### **Exemplo 4: Histórico de conversas (localStorage)**

Veja o exemplo completo em: [`codigos/exemplo-historico.tsx`](codigos/exemplo-historico.tsx)

### **Exemplo 5: Analytics/Tracking**

Veja o exemplo completo em: [`codigos/exemplo-analytics.tsx`](codigos/exemplo-analytics.tsx)

---

## 🚨 Troubleshooting

### **Erro: "Failed to fetch"**
- Verifique se o WEBHOOK_URL está correto
- Confirme que o backend está rodando
- Verifique configurações de CORS

### **Widget não aparece**
- Verifique o z-index (deve ser alto, ex: 50)
- Confirme que o Tailwind CSS está configurado corretamente
- Verifique se há conflitos de CSS

### **Mensagens não são enviadas**
- Abra o Console do navegador (F12)
- Verifique erros de rede na aba Network
- Confirme o formato do payload enviado ao backend

### **Botão do WhatsApp não funciona**
- Verifique se o número está no formato correto (sem + e com código do país)
- Teste o link manualmente: `https://wa.me/5527999999999`
- Verifique se o navegador não está bloqueando pop-ups

---

## ✅ Checklist de Implementação

- [ ] Instalar dependências necessárias
- [ ] Criar arquivo `utils.ts` com função cn()
- [ ] Criar componentes UI básicos (Button, Input)
- [ ] Criar componente ChatWidget.tsx
- [ ] Personalizar constantes (WEBHOOK_URL, WHATSAPP_NUMBER, etc.)
- [ ] Personalizar cores e estilos
- [ ] Personalizar perguntas rápidas
- [ ] Personalizar respostas automáticas
- [ ] Integrar widget na página principal
- [ ] Configurar backend/webhook
- [ ] Testar envio de mensagens
- [ ] Testar botão do WhatsApp
- [ ] Testar responsividade mobile
- [ ] Configurar CORS se necessário
- [ ] Adicionar analytics (opcional)

---

## 📚 Recursos Adicionais

- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação Lucide Icons](https://lucide.dev/)
- [Documentação shadcn/ui](https://ui.shadcn.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**🎉 Pronto! Seu widget de chat está implementado!**

Para dúvidas ou suporte, consulte a documentação das bibliotecas utilizadas ou abra uma issue no repositório do projeto.