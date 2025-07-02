import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/layout/Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types/user';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TransactionHistoryPage() {
  const { currentUser, isAuthenticated, pendingTransactions } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedHashes, setExpandedHashes] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Get user's transactions
  const userTransactions = pendingTransactions.filter(tx => 
    tx.sender === currentUser?.email || tx.recipient === currentUser?.email
  );
  
  // Filter transactions based on search term
  const filteredTransactions = userTransactions.filter(tx => 
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Separate transactions by status
  const pendingTxs = filteredTransactions.filter(tx => tx.status === 'pending');
  const approvedTxs = filteredTransactions.filter(tx => tx.status === 'approved');
  const rejectedTxs = filteredTransactions.filter(tx => tx.status === 'rejected');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/20">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-500/20">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-500/20">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDirectionBadge = (tx: Transaction) => {
    if (tx.sender === currentUser?.email) {
      return <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-500/20">Sent</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/20">Received</Badge>;
    }
  };
  
  const toggleHash = (hash: string) => {
    setExpandedHashes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hash)) {
        newSet.delete(hash);
      } else {
        newSet.add(hash);
      }
      return newSet;
    });
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <Dashboard title="Transaction History">
      <div className="mb-6">
        <Input
          placeholder="Search by transaction hash, recipient or sender"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {filteredTransactions.length === 0 ? (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>No Transactions</CardTitle>
            <CardDescription>
              You haven't made any transactions yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All ({filteredTransactions.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingTxs.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedTxs.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedTxs.length})</TabsTrigger>
          </TabsList>
          
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              <div className="glass-card p-6 rounded-xl animate-scale-in">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Transaction Hash</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Direction</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">{currentUser.email === status ? 'From' : 'To'}</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Amount</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Status</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">Trust Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(status === 'all' ? filteredTransactions : 
                        status === 'pending' ? pendingTxs : 
                        status === 'approved' ? approvedTxs : 
                        rejectedTxs).map((tx) => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleHash(tx.hash)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {expandedHashes.has(tx.hash) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                              <div className="font-mono text-xs">
                                {expandedHashes.has(tx.hash) ? (
                                  <div className="break-all">{tx.hash}</div>
                                ) : (
                                  <div className="truncate max-w-[150px]">{tx.hash}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{getDirectionBadge(tx)}</td>
                          <td className="py-3 px-4 text-sm">
                            {tx.sender === currentUser.email ? tx.recipient : tx.sender}
                          </td>
                          <td className="py-3 px-4 text-sm">${tx.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm">{formatDate(tx.timestamp)}</td>
                          <td className="py-3 px-4 text-sm">{getStatusBadge(tx.status)}</td>
                          <td className="py-3 px-4 text-sm">
                            {tx.status === 'approved' && tx.trustPointsEarned && (
                              <span className="text-green-400">+{tx.trustPointsEarned}</span>
                            )}
                            {tx.status !== 'approved' && "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Dashboard>
  );
}
