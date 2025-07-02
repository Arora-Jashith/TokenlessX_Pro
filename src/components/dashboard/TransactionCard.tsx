
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "../../contexts/AuthContext";

export default function TransactionCard() {
  const { toast } = useToast();
  const { currentUser, executeTransaction } = useAuth();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient) {
      toast({
        title: "Error",
        description: "Please enter a recipient email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (currentUser && parseFloat(amount) > currentUser.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds to complete this transaction",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await executeTransaction(recipient, parseFloat(amount));
      
      // Clear form
      setRecipient("");
      setAmount("");
      
      toast({
        title: "Transaction Initiated",
        description: "Your transaction is pending admin approval",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Transaction failed";
      
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl animate-scale-in">
      <h3 className="text-xl font-bold mb-4">Initiate Secure Transaction</h3>
      <p className="text-muted-foreground mb-6 text-sm">Transactions are validated through our game theory-based trust network</p>
      
      <form onSubmit={handleTransaction} className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient Email *</Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="pl-10"
              placeholder="Enter recipient's email"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="amount">Amount *</Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              $
            </div>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isProcessing}
          className="w-full green-gradient h-12 mt-2"
        >
          {isProcessing ? 'Processing...' : 'Initiate Transaction'}
          <svg
            className="ml-2 h-5 w-5"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 14 0"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Button>
      </form>
    </div>
  );
}
