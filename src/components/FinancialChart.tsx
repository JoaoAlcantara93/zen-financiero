import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Transaction {
  type: "income" | "expense";
  category: string;
  amount: number;
}

interface FinancialChartProps {
  transactions: Transaction[];
}

// Cores para as categorias (pode personalizar)
const COLORS = [
  '#0088FE', //teste
  '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1',
  '#D084D0', '#FF7C7C', '#A4DE6C', '#D0D084'
];

const FinancialChart = ({ transactions }: FinancialChartProps) => {
  // Agrupar por categoria para o gráfico de rosca
  const categoryData = transactions.reduce((acc, transaction) => {
    const existing = acc.find((item) => item.name === transaction.category);
    
    if (existing) {
      existing.value += transaction.amount;
      // Podemos também guardar o tipo para usar na legenda
      existing.transactions = (existing.transactions || 0) + 1;
    } else {
      acc.push({
        name: transaction.category,
        value: transaction.amount,
        transactions: 1
      });
    }
    
    return acc;
  }, [] as Array<{ name: string; value: number; transactions?: number }>);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Distribuição por Categoria</CardTitle>
        <CardDescription className="text-muted-foreground">
          Visualize o total por categoria em formato de rosca
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Adicione transações para ver o gráfico
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // Opcional: mostrar labels nas fatias
                label={({ name, percent }) => 
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                innerRadius={60} // Isso cria o efeito "rosquinha"
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `R$ ${value.toFixed(2)}`,
                  'Valor'
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialChart;