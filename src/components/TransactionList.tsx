import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  description: string | null;
  frequency: "fixed" | "variable" | "future";
  status: "pending" | "confirmed";
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: () => void;
}

const TransactionList = ({ transactions, onDelete }: TransactionListProps) => {
  const handleConfirm = async (id: string, type: "income" | "expense") => {
    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);

      if (error) throw error;

      toast.success(type === "income" ? "✅ Recebimento confirmado!" : "✅ Pagamento confirmado!");
      onDelete();
    } catch (error: any) {
      toast.error(error.message || "Erro ao confirmar transação");
    }
  };

  const getFrequencyBadge = (frequency: Transaction["frequency"]) => {
    const badges = {
      fixed: { label: "🔒 Fixo", variant: "default" as const },
      variable: { label: "🎲 Variável", variant: "secondary" as const },
      future: { label: "📅 Futuro", variant: "outline" as const },
    };
    return badges[frequency];
  };

  // Filtrar apenas transações pendentes
  const pendingTransactions = transactions.filter(t => t.status === "pending");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Transações Recentes</CardTitle>
        <CardDescription className="text-muted-foreground">
          Histórico de todas as suas movimentações
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma transação pendente. Todas as transações foram confirmadas! 🎉
          </p>
        ) : (
          <div className="space-y-3">
            {pendingTransactions.map((transaction) => {
              const frequencyBadge = getFrequencyBadge(transaction.frequency);
              return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{transaction.title}</p>
                      <Badge variant={frequencyBadge.variant} className="text-xs">
                        {frequencyBadge.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      transaction.type === "income" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 border-success text-success hover:bg-success hover:text-success-foreground"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirmar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">
                          Confirmar {transaction.type === "income" ? "recebimento" : "pagamento"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Ao confirmar, esta transação será removida da lista de pendentes. 
                          Tem certeza que {transaction.type === "income" ? "recebeu" : "pagou"} <strong>{transaction.title}</strong>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleConfirm(transaction.id, transaction.type)}
                          className="bg-success text-success-foreground hover:bg-success/90"
                        >
                          Sim, confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
