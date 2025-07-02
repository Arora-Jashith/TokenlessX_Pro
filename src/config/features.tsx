import { BarChart3, ShieldCheck, Wallet, ArrowUpDown } from "lucide-react";

export const features = [
  
  {
    title: "Strategic Incentive Alignment",
    description: "Dynamically structure rewards and penalties so every participant's optimal move keeps the network honest.",
    icon: <Wallet className="w-6 h-6" />,
    image: ""
  },
  {
    title: "Reputation-Based Validation",
    description: "Replace staking with real-time behavior scoring and peer-review feedback to authenticate each trade.",
    icon: <ShieldCheck className="w-6 h-6" />,
    image: ""
  },
  {
    title: "Nash Equilibrium Settlement",
    description: "Automatically compute fair exchange terms via equilibrium analysis, ensuring transparent, dispute-free settlements.",
    icon: <ArrowUpDown className="w-6 h-6" />,
    image: ""
  },
  {
    title: "Adaptive Risk Management",
    description: "Use payoff-matrix simulations to adjust transaction parameters on-the-fly, minimizing counterparty risk.",
    icon: <BarChart3 className="w-6 h-6" />,
    image: ""
  }
];