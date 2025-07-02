
import { TrendingUp } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  reputationGrowth: number;
}

export default function BalanceCard({ balance, reputationGrowth }: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="glass-card p-6 rounded-xl animate-scale-in">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
          <svg
            className="h-4 w-4 text-purple-light"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-muted-foreground">Available Balance</h3>
      </div>

      <div className="mt-3">
        <div className="text-4xl font-bold">{formatCurrency(balance)}</div>
        
        <div className="mt-4 flex items-center text-green-400">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Reputation Growth: +{reputationGrowth}%</span>
        </div>
      </div>
    </div>
  );
}
