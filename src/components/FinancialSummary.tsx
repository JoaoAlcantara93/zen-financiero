import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";

interface FinancialSummaryProps {
  income: number;
  expense: number;
  balance: number;
}

const FinancialSummary = ({ income, expense, balance }: FinancialSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{formatCurrency(income)}</div>
          <p className="text-xs text-muted-foreground mt-1">Total de entradas</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{formatCurrency(expense)}</div>
          <p className="text-xs text-muted-foreground mt-1">Total de saídas</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card hover:bg-card/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? "text-success" : "text-destructive"}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Balanço do mês</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummary;
