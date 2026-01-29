
import { Lead, UserProfile } from '../types';

export const sendTelegramNotification = async (lead: Lead, profile: UserProfile) => {
  if (!profile.telegramBotToken || !profile.telegramChatId || !profile.enableTelegramAlerts) return;

  const message = `
🚀 *NOVO LEAD IDENTIFICADO* 🚀
━━━━━━━━━━━━━━━━━━
👤 *Nome:* ${lead.name}
📍 *Local:* ${lead.location}
🔥 *Score:* ${lead.score}%
🏢 *Tipo:* ${lead.type === 'buyer' ? 'Comprador' : 'Proprietário'}

📝 *Necessidade:*
"${lead.need}"

🎯 *Triggers:*
${lead.triggers.map(t => `• ${t}`).join('\n')}

📱 *Origem:* ${lead.foundAt}
━━━━━━━━━━━━━━━━━━
_Enviado via AgentPulse Protocol_
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${profile.telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: profile.telegramChatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar para Telegram:', error);
    return false;
  }
};

export const testTelegramConnection = async (token: string, chatId: string) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✅ *AgentPulse AI:* Conexão estabelecida com sucesso! Protocolo Alpha Ativo.',
        parse_mode: 'Markdown'
      })
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
