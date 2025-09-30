// Backend Node.js com Express
import express from 'express';
import cors from 'cors';

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'https://seusite.com', // ⚠️ Altere para o domínio do seu frontend
  methods: ['POST'],
  credentials: true
}));

app.use(express.json());

// Endpoint do webhook
app.post('/api/webhook', async (req, res) => {
  const { message, sessionId, timestamp } = req.body;

  console.log('Received message:', message);
  console.log('Session ID:', sessionId);
  console.log('Timestamp:', timestamp);

  // ⚠️ AQUI: Integre com sua IA, banco de dados, etc.
  let botResponse = 'Obrigado por sua mensagem!';

  // Exemplo simples de lógica baseada em palavras-chave
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
    botResponse = 'Nossos planos começam em R$ 99/mês! Entre em contato para mais detalhes.';
  } else if (lowerMessage.includes('reunião') || lowerMessage.includes('demonstração')) {
    botResponse = 'Ótimo! Vou conectar você com nossa equipe. Use o botão do WhatsApp para continuar.';
  } else if (lowerMessage.includes('funciona')) {
    botResponse = 'Nosso sistema funciona através de IA avançada que entende suas necessidades e responde de forma natural!';
  }

  // ⚠️ EXEMPLO: Integração com OpenAI (opcional)
  // const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4',
  //     messages: [{ role: 'user', content: message }]
  //   })
  // });
  // const data = await openaiResponse.json();
  // botResponse = data.choices[0].message.content;

  // Retornar resposta
  res.json({
    response: botResponse,
    sessionId: sessionId,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook listening on port ${PORT}`);
});