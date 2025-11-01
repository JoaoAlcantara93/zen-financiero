import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Lock, TrendingUp } from "lucide-react";

interface Transaction {
  amount: number;
  type: "income" | "expense";
  frequency: "fixed" | "variable" | "future";
  status: "pending" | "confirmed";
}

interface FinancialSummaryProps {
  transactions: Transaction[];
}

const FinancialSummary = ({ transactions }: FinancialSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Calcular apenas transações pendentes
  const pending = transactions.filter(t => t.status === "pending");
  
  const toReceive = pending
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  
  const toPay = pending
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  
  const balance = toReceive - toPay;

  const fixedIncome = pending
    .filter(t => t.type === "income" && t.frequency === "fixed")
    .reduce((acc, t) => acc + t.amount, 0);

  const fixedExpense = pending
    .filter(t => t.type === "expense" && t.frequency === "fixed")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">A Receber</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{formatCurrency(toReceive)}</div>
          <p className="text-xs text-muted-foreground mt-1">Receitas pendentes</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">A Pagar</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{formatCurrency(toPay)}</div>
          <p className="text-xs text-muted-foreground mt-1">Despesas pendentes</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Previsto</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? "text-success" : "text-destructive"}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">A receber - A pagar</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receitas Fixas</CardTitle>
          <Lock className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{formatCurrency(fixedIncome)}</div>
          <p className="text-xs text-muted-foreground mt-1">Entradas fixas</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Despesas Fixas</CardTitle>
          <Lock className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{formatCurrency(fixedExpense)}</div>
          <p className="text-xs text-muted-foreground mt-1">Saídas fixas</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
