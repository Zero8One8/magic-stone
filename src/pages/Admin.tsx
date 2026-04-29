import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogOut, RefreshCw, Inbox, Copy, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ContactRequest = Tables<"contact_requests">;
type LeadCapture = Tables<"lead_captures">;
type PaymentOrder = Tables<"payment_orders">;
type DeliveryRequest = Tables<"delivery_requests">;
type Customer = Tables<"customers">;

const STATUS_OPTIONS = [
  { value: "new", label: "Новая", color: "bg-blue-500/20 text-blue-400" },
  { value: "in_progress", label: "В работе", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "done", label: "Завершена", color: "bg-green-500/20 text-green-400" },
  { value: "rejected", label: "Отклонена", color: "bg-red-500/20 text-red-400" },
];

const Admin = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [leads, setLeads] = useState<LeadCapture[]>([]);
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    const [requestsResult, leadsResult, ordersResult, deliveriesResult, customersResult] = await Promise.all([
      supabase.from("contact_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("lead_captures").select("*").order("created_at", { ascending: false }),
      supabase.from("payment_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("delivery_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
    ]);

    if (requestsResult.error) {
      toast({ title: "Ошибка", description: requestsResult.error.message, variant: "destructive" });
    } else {
      setRequests(requestsResult.data || []);
    }

    if (leadsResult.error) {
      toast({ title: "Ошибка", description: leadsResult.error.message, variant: "destructive" });
    } else {
      setLeads(leadsResult.data || []);
    }

    if (!ordersResult.error) setPaymentOrders((ordersResult.data as PaymentOrder[]) || []);
    if (!deliveriesResult.error) setDeliveryRequests((deliveriesResult.data as DeliveryRequest[]) || []);
    if (!customersResult.error) setCustomers((customersResult.data as Customer[]) || []);

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

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: `${label} скопирован` });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось скопировать", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const requestSources = Array.from(new Set(requests.map((r) => r.source || "unknown"))).sort();
  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (sourceFilter !== "all" && (r.source || "unknown") !== sourceFilter) return false;
    return true;
  });

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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Фильтр по статусу</p>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Фильтр по источнику</p>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все источники</SelectItem>
                {requestSources.map((source) => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredRequests.length === 0 && !loading ? (
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
                  <TableHead>Источник</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Telegram / WhatsApp</TableHead>
                  <TableHead>Услуга</TableHead>
                  <TableHead>Комментарий</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(r.created_at)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.source || "—"}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{r.phone}</span>
                        <button onClick={() => copyText(r.phone, "Телефон")} className="text-muted-foreground hover:text-foreground">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="text-muted-foreground hover:text-foreground">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      {r.contact_method ? (
                        <div className="flex items-center gap-2">
                          <span>{r.contact_method}</span>
                          <button onClick={() => copyText(r.contact_method || "", "Контакт") } className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : "—"}
                    </TableCell>
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

        <div className="space-y-4 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">📬 Подписки и лид-магниты</h2>
            <p className="text-sm text-muted-foreground">Всего: {leads.length}</p>
          </div>

          {leads.length === 0 && !loading ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
              <p>Лидов пока нет</p>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Источник</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Страница</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-xs">{formatDate(lead.created_at)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lead.source}</TableCell>
                      <TableCell>{lead.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{lead.email}</span>
                          <button onClick={() => copyText(lead.email, "Email")} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lead.page_url || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Заказы на оплату */}
        <div className="space-y-4 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">🛒 Заказы</h2>
            <p className="text-sm text-muted-foreground">Всего: {paymentOrders.length}</p>
          </div>
          {paymentOrders.length === 0 && !loading ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
              <Inbox className="mx-auto h-10 w-10 mb-3 opacity-40" />
              <p>Заказов пока нет</p>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>ID заказа</TableHead>
                    <TableHead>Товар / услуга</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="whitespace-nowrap text-xs">{formatDate(o.created_at)}</TableCell>
                      <TableCell className="text-xs font-mono">{o.order_id}</TableCell>
                      <TableCell className="text-sm">{o.item_name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{o.item_type}</TableCell>
                      <TableCell className="font-semibold">{o.amount} ₽</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          o.status === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : o.status === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {o.status === "paid" ? "Оплачен" : o.status === "cancelled" ? "Отменён" : "Ожидает"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Заявки на доставку */}
        <div className="space-y-4 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">🚚 Доставки</h2>
            <p className="text-sm text-muted-foreground">Всего: {deliveryRequests.length}</p>
          </div>
          {deliveryRequests.length === 0 && !loading ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
              <p>Заявок на доставку пока нет</p>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Заказ</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Пункт выдачи</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryRequests.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="whitespace-nowrap text-xs">{formatDate(d.created_at)}</TableCell>
                      <TableCell className="text-xs font-mono">{d.order_id}</TableCell>
                      <TableCell>{d.customer_name}</TableCell>
                      <TableCell className="text-xs">{d.email || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{d.phone}</span>
                          <button onClick={() => copyText(d.phone, "Телефон")} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{d.city}</TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">{d.pickup_point}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          d.status === "sent" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {d.status === "sent" ? "Отправлено" : "Новая"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* База клиентов */}
        <div className="space-y-4 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">👥 База клиентов</h2>
            <p className="text-sm text-muted-foreground">Всего: {customers.length}</p>
          </div>
          {customers.length === 0 && !loading ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
              <p>Клиентов пока нет</p>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>#</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Источник</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="whitespace-nowrap text-xs">{formatDate(c.created_at)}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{c.customer_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{c.email}</span>
                          <button onClick={() => copyText(c.email, "Email")} className="text-muted-foreground hover:text-foreground">
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>{c.name || "—"}</TableCell>
                      <TableCell>{c.phone || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{c.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
