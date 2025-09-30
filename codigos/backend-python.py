# Backend Python com Flask
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)

# Configurar CORS
CORS(app, origins=['https://seusite.com'])  # ⚠️ Altere para o domínio do seu frontend

# Endpoint do webhook
@app.route('/api/webhook', methods=['POST'])
def webhook():
    data = request.json
    message = data.get('message', '')
    session_id = data.get('sessionId', '')
    timestamp = data.get('timestamp', '')

    print(f'Received message: {message}')
    print(f'Session ID: {session_id}')
    print(f'Timestamp: {timestamp}')

    # ⚠️ AQUI: Integre com sua IA, banco de dados, etc.
    bot_response = 'Obrigado por sua mensagem!'

    # Exemplo simples de lógica baseada em palavras-chave
    lower_message = message.lower()

    if 'preço' in lower_message or 'valor' in lower_message:
        bot_response = 'Nossos planos começam em R$ 99/mês! Entre em contato para mais detalhes.'
    elif 'reunião' in lower_message or 'demonstração' in lower_message:
        bot_response = 'Ótimo! Vou conectar você com nossa equipe. Use o botão do WhatsApp para continuar.'
    elif 'funciona' in lower_message:
        bot_response = 'Nosso sistema funciona através de IA avançada que entende suas necessidades e responde de forma natural!'

    # ⚠️ EXEMPLO: Integração com OpenAI (opcional)
    # import openai
    # openai.api_key = os.getenv('OPENAI_API_KEY')
    # response = openai.ChatCompletion.create(
    #     model='gpt-4',
    #     messages=[{'role': 'user', 'content': message}]
    # )
    # bot_response = response.choices[0].message.content

    # Retornar resposta
    return jsonify({
        'response': bot_response,
        'sessionId': session_id,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(port=3000, debug=True)