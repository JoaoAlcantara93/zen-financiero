import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState } from "react";

interface Transaction {
  type: "income" | "expense";
  category: string;
  amount: number;
}

interface FinancialChartProps {
  transactions: Transaction[];
}

// Custom Tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="text-foreground font-medium">{payload[0].name}</p>
        <p className="text-foreground">
          Valor: <span className="text-primary">R$ {payload[0].value.toFixed(2)}</span>
        </p>
        <p className="text-muted-foreground text-sm">
          {((payload[0].payload.percent || 0) * 100).toFixed(1)}% do total
        </p>
      </div>
    );
  }
  return null;
};

// Cores para as categorias
const RENDA_CORES = ['#00C49F', '#82CA9D', '#A4DE6C', '#08851B', '#00C49F', '#82CA9D'];
const GASTOS_CORES = ['#FF4444', '#FF8E8E', '#FFAAAA', '#FF7C7C', '#FF5757', '#FF6B6B'];

const FinancialChart = ({ transactions }: FinancialChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Separar transações por tipo
  const incomeTransactions = transactions.filter(t => t.type === "income");
  const expenseTransactions = transactions.filter(t => t.type === "expense");

  // Agrupar por categoria para o gráfico de rosca
  const categoryData = transactions.reduce((acc, transaction) => {
    const existing = acc.find((item) => item.name === transaction.category);
    
    if (existing) {
      existing.value += Math.abs(transaction.amount);
      existing.transactions = (existing.transactions || 0) + 1;
    } else {
      acc.push({
        name: transaction.category,
        value: Math.abs(transaction.amount),
        type: transaction.type, // Manter o tipo para aplicar as cores corretas
        transactions: 1
      });
    }
    
    return acc;
  }, [] as Array<{ name: string; value: number; type: string; transactions?: number }>);

  // Calcular percentuais
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercent = categoryData.map(item => ({
    ...item,
    percent: item.value / total
  }));

  // Função para obter a cor baseada no tipo da transação
  const getColorForCategory = (categoryType: string, index: number) => {
    if (categoryType === "income") {
      return RENDA_CORES[index % RENDA_CORES.length];
    } else {
      return GASTOS_CORES[index % GASTOS_CORES.length];
    }
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

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
                data={dataWithPercent}
                cx="50%"
                cy="50%"
                labelLine={false}
                // Opcional: mostrar labels nas fatias
                label={({ name, percent }) => 
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                innerRadius={60} // Isso cria o efeito "rosquinha"
                dataKey="value"
                nameKey="name"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                activeIndex={activeIndex ?? undefined}
                activeShape={{
                  stroke: "hsl(var(--border))",
                  strokeWidth: 2,
                }}
              >
                {dataWithPercent.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getColorForCategory(entry.type, index)} 
                    opacity={activeIndex === index ? 1 : 0.8}
                  />
                ))}
              </Pie>
              
              {/* Usando o CustomTooltip para evitar o fundo preto */}
              <Tooltip content={<CustomTooltip />} />
              
              <Legend 
                formatter={(value, entry: any) => (
                  <span style={{ color: 'hsl(var(--foreground))' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialChart;