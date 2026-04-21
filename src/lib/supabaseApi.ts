/**
 * Supabase API integration для фронтенда
 * Используется QuizPopup, EmailSubscription, ChatWidget для отправки данных
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

export const supabaseApi = {
  /**
   * Подписать на email
   */
  async subscribeEmail(email: string, source: string = 'pop-up'): Promise<boolean> {
    if (!API_BASE) return false;
    try {
      const response = await fetch(`${API_BASE}/api/subscribe-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Email subscription error:', error);
      return false;
    }
  },

  /**
   * Отправить сообщение из чата
   */
  async sendChatMessage(message: string, userId?: string, email?: string): Promise<boolean> {
    if (!API_BASE) return false;
    try {
      const response = await fetch(`${API_BASE}/api/chat-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || `guest_${Date.now()}`,
          message,
          email,
        }),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Chat error:', error);
      return false;
    }
  },

  /**
   * Получить историю чата для пользователя
   */
  async getChatHistory(userId?: string): Promise<{ text: string; isBot: boolean }[]> {
    if (!API_BASE) return [];
    try {
      const response = await fetch(`${API_BASE}/api/chat-history?user_id=${userId || `guest_${Date.now()}`}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        return data.messages || [];
      }
      return [];
    } catch (error) {
      console.error('Get chat history error:', error);
      return [];
    }
  },

  /**
   * Сохранить результат квиза
   */
  async saveQuizResult(
    email: string,
    result: Record<string, unknown>,
    name?: string
  ): Promise<boolean> {
    if (!API_BASE) return false;
    try {
      const response = await fetch(`${API_BASE}/api/quiz-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, result }),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Quiz error:', error);
      return false;
    }
  },
};

export default supabaseApi;
