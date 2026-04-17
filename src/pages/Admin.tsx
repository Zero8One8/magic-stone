import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogOut, RefreshCw, Inbox } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ContactRequest = Tables<"contact_requests">;

const STATUS_OPTIONS = [
  { value: "new", label: "Новая", color: "bg-blue-500/20 text-blue-400" },
  { value: "in_progress", label: "В работе", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "done", label: "Завершена", color: "bg-green-500/20 text-green-400" },
  { value: "rejected", label: "Отклонена", color: "bg-red-500/20 text-red-400" },
];

const Admin = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      else fetchRequests();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("contact_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast({ title: "Статус обновлён" });
    }
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase.from("contact_requests").delete().eq("id", id);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Заявка удалена" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${opt.color}`}>{opt.label}</span>;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">📋 Заявки с сайта</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Обновить
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATUS_OPTIONS.map((s) => (
            <div key={s.value} className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground">
                {requests.filter((r) => r.status === s.value).length}
              </p>
            </div>
          ))}
        </div>

        {requests.length === 0 && !loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <Inbox className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Заявок пока нет</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Услуга</TableHead>
                  <TableHead>Комментарий</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(r.created_at)}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell className="text-sm">{r.service}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{r.comment || "—"}</TableCell>
                    <TableCell>
                      <Select defaultValue={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={() => deleteRequest(r.id)}>
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
