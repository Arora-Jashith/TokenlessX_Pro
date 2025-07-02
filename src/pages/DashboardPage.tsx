import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/layout/Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UserCarousel } from '../components/ui/user-carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { User } from '../types/user';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { GlowingEffect } from '../components/ui/glowing-effect';

const chartData = [
  { month: 'Jan', amount: 2500 },
  { month: 'Feb', amount: 4500 },
  { month: 'Mar', amount: 3500 },
  { month: 'Apr', amount: 4700 },
  { month: 'May', amount: 5800 },
  { month: 'Jun', amount: 4000 },
  { month: 'Jul', amount: 4200 },
  { month: 'Aug', amount: 5500 },
  { month: 'Sep', amount: 2000 },
  { month: 'Oct', amount: 3000 },
  { month: 'Nov', amount: 1700 },
  { month: 'Dec', amount: 1800 },
];

export default function DashboardPage() {
  const { currentUser, isAuthenticated, allUsers, executeTransaction } = useAuth();
  const navigate = useNavigate();
  
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!currentUser) {
    return null;
  }
  
  const otherUsers = allUsers ? allUsers.filter(user => user.email !== currentUser.email) : [];
  
  const handlePayClick = (user: User) => {
    setSelectedUser(user);
    setIsPaymentDialogOpen(true);
  };
  
  const handleSendPayment = async () => {
    if (!selectedUser || !paymentAmount || isNaN(parseFloat(paymentAmount))) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    
    if (amount > currentUser.balance) {
      toast.error("Insufficient balance");
      return;
    }
    
    try {
      await executeTransaction(selectedUser.email, amount);
      toast.success(`Payment of $${amount} to ${selectedUser.name} is pending approval`);
      setIsPaymentDialogOpen(false);
      setPaymentAmount("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Transaction failed";
      toast.error(errorMessage);
    }
  };

  return (
    <Dashboard>
      {/* Seamless summary stats */}
      <div className="relative rounded-2xl border border-green-700 mb-8">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <div className="relative rounded-2xl border border-green-700">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div className="bg-white dark:bg-black rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Total Balance</span>
              <span className="text-3xl font-bold text-black dark:text-white">${currentUser.balance.toFixed(2)}</span>
              <span className="text-xs text-green-500">+20.1% from last month</span>
            </div>
          </div>
          <div className="relative rounded-2xl border border-green-700">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div className="bg-white dark:bg-black rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Reputation</span>
              <span className="text-3xl font-bold text-black dark:text-white">{currentUser.reputation}</span>
              <span className="text-xs text-green-500">+{currentUser.reputationGrowth}% growth</span>
            </div>
          </div>
          <div className="relative rounded-2xl border border-green-700">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div className="bg-white dark:bg-black rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Trust Network</span>
              <span className="text-3xl font-bold text-black dark:text-white">{currentUser.trustNetworkStrength}%</span>
              <span className="text-xs text-green-500">+12% from last month</span>
            </div>
          </div>
          <div className="relative rounded-2xl border border-green-700">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
            <div className="bg-white dark:bg-black rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Active Now</span>
              <span className="text-3xl font-bold text-black dark:text-white">{otherUsers.length}</span>
              <span className="text-xs text-green-500">+5 since last hour</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-0 gap-y-8 mb-8">
        {/* Chart */}
        <div className="relative rounded-2xl border border-green-700 lg:col-span-8 mb-8 lg:mb-0">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="bg-white dark:bg-black rounded-2xl p-6 flex flex-col h-full">
            <span className="text-lg font-semibold mb-4 text-black dark:text-white">Transaction Overview</span>
            <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis 
                  fontSize={12} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount']} 
                  labelStyle={{ color: 'black' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white' 
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#6DE77B" 
                  radius={[4, 4, 0, 0]} 
                  fillOpacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
            </div>
                </div>
            </div>
            
        {/* Recent transactions list */}
        <div className="relative rounded-2xl border border-green-700 lg:col-span-4">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="bg-white dark:bg-black rounded-2xl p-6 flex flex-col h-full">
            <span className="text-lg font-semibold mb-4 text-black dark:text-white">Recent Transactions</span>
            <div className="space-y-6">
              {/* Example transaction items, replace with real data as needed */}
              {[
                { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00', initial: 'O' },
                { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00', initial: 'J' },
                { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00', initial: 'I' },
                { name: 'William Kim', email: 'will@email.com', amount: '+$99.00', initial: 'W' },
                { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00', initial: 'S' },
              ].map((tx, idx) => (
                <div key={idx} className="relative rounded-2xl border border-green-700 p-4 flex items-center justify-between bg-white dark:bg-black">
                  <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
              <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center bg-green-900/20 w-8 h-8 rounded-full text-green-light">{tx.initial}</span>
                <div>
                      <div className="font-medium text-black dark:text-white">{tx.name}</div>
                      <div className="text-xs text-muted-foreground">{tx.email}</div>
                </div>
              </div>
                  <div className="font-medium text-green-light">{tx.amount}</div>
                </div>
              ))}
            </div>
                </div>
              </div>
      </div>

      {/* Send Money Section */}
      <div className="relative rounded-2xl border border-green-700 mb-8">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="p-6">
          <span className="text-lg font-semibold mb-4 block">Send Money</span>
          <div className="bg-white dark:bg-black rounded-2xl p-6">
            <UserCarousel users={otherUsers.map(user => ({
              id: user.id,
              name: user.name,
              email: user.email,
            }))} onPayClick={handlePayClick} />
          </div>
        </div>
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <div className="relative rounded-2xl border border-green-700">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <DialogContent className="bg-white dark:bg-black max-w-md p-8 rounded-2xl shadow-2xl border-none">
          <DialogHeader>
              <div className="flex flex-col items-center gap-4 mb-2">
                {selectedUser && (
                  <>
                    <Avatar className="h-16 w-16 shadow-lg">
                      <AvatarFallback className="bg-green-900 text-2xl font-bold text-green-400">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-lg font-semibold text-black dark:text-white">{selectedUser.name}</div>
                    <div className="text-sm text-green-400">{selectedUser.email}</div>
                  </>
                )}
              </div>
              <DialogTitle className="text-center text-black dark:text-white">Send Payment</DialogTitle>
              <DialogDescription className="text-center text-green-300">
              Enter the amount you want to send. This payment will be pending until approved by an admin.
            </DialogDescription>
          </DialogHeader>
                <Input
              placeholder="Amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
              className="mb-6 text-lg px-4 py-3 rounded-xl bg-[#23272b] border-none focus:ring-2 focus:ring-green-400 text-white"
                />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
              <Button onClick={handleSendPayment} className="font-semibold">
              Send Payment
            </Button>
          </DialogFooter>
        </DialogContent>
        </div>
      </Dialog>
    </Dashboard>
  );
}
