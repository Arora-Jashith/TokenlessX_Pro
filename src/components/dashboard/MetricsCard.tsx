
import { Progress } from "../ui/progress";

interface MetricsCardProps {
  trustNetworkStrength: number;
  transactionSuccessRate: number;
}

export default function MetricsCard({ trustNetworkStrength, transactionSuccessRate }: MetricsCardProps) {
  return (
    <div className="glass-card p-6 rounded-xl animate-scale-in">
      <h3 className="text-xl font-bold mb-4">Game Theory Metrics</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Trust Network Strength</span>
            <span className="text-sm font-semibold">{trustNetworkStrength}%</span>
          </div>
          <Progress value={trustNetworkStrength} className="h-2 bg-secondary [&>div]:bg-green-light" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Transaction Success Rate</span>
            <span className="text-sm font-semibold">{transactionSuccessRate}%</span>
          </div>
          <Progress value={transactionSuccessRate} className="h-2 bg-secondary [&>div]:bg-green-light" />
        </div>
      </div>
    </div>
  );
}
