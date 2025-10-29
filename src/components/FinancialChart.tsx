import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Transaction {
  type: "income" | "expense";
  category: string;
  amount: number;
}

interface FinancialChartProps {
  transactions: Transaction[];
}

const FinancialChart = ({ transactions }: FinancialChartProps) => {
  const categoryData = transactions.reduce((acc, transaction) => {
    const existing = acc.find((item) => item.category === transaction.category);
    
    if (existing) {
      if (transaction.type === "income") {
        existing.income += transaction.amount;
      } else {
        existing.expense += transaction.amount;
      }
    } else {
      acc.push({
        category: transaction.category,
        income: transaction.type === "income" ? transaction.amount : 0,
        expense: transaction.type === "expense" ? transaction.amount : 0,
      });
    }
    
    return acc;
  }, [] as Array<{ category: string; income: number; expense: number }>);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Análise por Categoria</CardTitle>
        <CardDescription className="text-muted-foreground">
          Visualize suas receitas e despesas por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Adicione transações para ver o gráfico
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="hsl(var(--chart-income))" name="Receitas" />
              <Bar dataKey="expense" fill="hsl(var(--chart-expense))" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialChart;
