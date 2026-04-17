import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 5000);
      }
    } catch (error) {
      console.error("Ошибка подписки:", error);
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-primary">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm">Подписка оформлена!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="flex gap-2">
      <div className="relative flex-1 min-w-0">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="email"
          placeholder="твоя почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>
      <Button type="submit" disabled={loading} variant="outline" size="sm">
        {loading ? "..." : "Подписать"}
      </Button>
    </form>
  );
};

export default EmailSubscription;
