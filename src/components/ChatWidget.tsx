import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabaseApi } from "@/lib/supabaseApi";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // Инициализация userId
  useEffect(() => {
    let id = localStorage.getItem("chatUserId");
    if (!id) {
      id = `guest_${Date.now()}`;
      localStorage.setItem("chatUserId", id);
    }
    setUserId(id);
  }, []);

  // Загрузка истории чата при открытии виджета
  useEffect(() => {
    if (isOpen && userId) {
      const loadHistory = async () => {
        const history = await supabaseApi.getChatHistory(userId);
        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([
            {
              text: "Привет! 👋 Я помощник проекта Магия Камней. Какой у тебя вопрос?",
              isBot: true,
            },
          ]);
        }
      };
      loadHistory();
    }
  }, [isOpen, userId]);

  // Сохранение сообщений в localStorage для быстрого доступа
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, isBot: true }]);
    } catch (error) {
      console.error("Ошибка чата:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Извини, была ошибка. Свяжись с нами в Telegram", isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Кнопка чата (по центру экрана) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Само окно чата */}
      {isOpen && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-h-96 bg-background border border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Заголовок */}
          <div className="flex items-center justify-between bg-primary/10 p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Помощь</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.isBot
                      ? "bg-primary/20 text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-primary/20 px-3 py-2 rounded-lg animate-pulse">...</div>
              </div>
            )}
          </div>

          {/* Инпут */}
          <form
            onSubmit={handleSend}
            className="border-t border-border p-3 flex gap-2 bg-background/50"
          >
            <input
              type="text"
              placeholder="Твой вопрос..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="sm"
              className="px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
