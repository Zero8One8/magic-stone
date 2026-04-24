import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({ title: "Ошибка входа", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast({ title: "Нужен email", description: "Введите email администратора и затем отправьте ссылку для сброса.", variant: "destructive" });
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setResetLoading(false);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Письмо отправлено", description: "Проверьте почту и откройте ссылку для смены пароля." });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Lock className="mx-auto h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Админ-панель</h1>
          <p className="text-sm text-muted-foreground">Войдите для управления сайтом</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </Button>
          <Button type="button" variant="ghost" className="w-full" disabled={resetLoading} onClick={handleResetPassword}>
            {resetLoading ? "Отправка..." : "Отправить ссылку для сброса пароля"}
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground">
          Если письмо не открывает страницу сброса, проверьте, что в Supabase разрешен redirect URL
          <br />
          {window.location.origin}/admin/reset-password
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
