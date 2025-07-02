import { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from '../components/layout/Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, UsersRound, ShieldAlert, CheckCircle, XCircle, Info, Clock, AlertTriangle, History, Settings, BarChart3 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import { User } from '../types/user';
import { Transaction } from '../types/user';
import { toast } from 'sonner';
import { TransactionAnimation } from '../components/ui/transaction-animation';

export default function AdminPage() {
  const { currentUser, isAuthenticated, allUsers = [], pendingTransactions = [], approveTx, rejectTx, flagTx, reviewTx, addUser, adjustTrustPoints, trustNetworkActivities = [] } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(pendingTransactions);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdjustTrustDialogOpen, setIsAdjustTrustDialogOpen] = useState(false);
  const [trustPointsChange, setTrustPointsChange] = useState(0);
  const [trustPointsReason, setTrustPointsReason] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [showTransactionAnimation, setShowTransactionAnimation] = useState(false);
  const [animationTransaction, setAnimationTransaction] = useState<Transaction | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (currentUser?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    setFilteredTransactions(pendingTransactions);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, currentUser, navigate, pendingTransactions]);
  
  useEffect(() => {
    const filtered = pendingTransactions.filter(tx => {
      const searchRegex = new RegExp(searchTerm, 'i');
      const matchesSearch = 
        searchRegex.test(tx.sender) || 
        searchRegex.test(tx.recipient) || 
        searchRegex.test(tx.hash) ||
        searchRegex.test(tx.amount.toString());
      const matchesStatus = selectedStatus === "all" ? true : tx.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    
    setFilteredTransactions(filtered);
  }, [pendingTransactions, searchTerm, selectedStatus]);
  
  const handleApprove = async (id: string) => {
    try {
      const transaction = (pendingTransactions || []).find(tx => tx.id === id);
      if (transaction) {
        setAnimationTransaction(transaction);
        setShowTransactionAnimation(true);
        await approveTx(id);
        toast.success('Transaction approved successfully');
      }
    } catch (error) {
      toast.error('Failed to approve transaction: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      const transaction = (pendingTransactions || []).find(tx => tx.id === id);
      if (transaction) {
        setAnimationTransaction(transaction);
        setShowTransactionAnimation(true);
        setIsRejectDialogOpen(true);
        setSelectedTransaction(transaction);
      }
    } catch (error) {
      toast.error('Failed to reject transaction: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  const handleConfirmReject = async () => {
    try {
      if (selectedTransaction) {
        await rejectTx(selectedTransaction.id, rejectionReason);
        setIsRejectDialogOpen(false);
        setRejectionReason('');
        setSelectedTransaction(null);
      }
    } catch (error) {
      toast.error('Failed to confirm rejection: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  const handleFlag = async (id: string) => {
    try {
      const transaction = (pendingTransactions || []).find(tx => tx.id === id);
      if (transaction) {
        setAnimationTransaction(transaction);
        setShowTransactionAnimation(true);
        await flagTx(id);
        toast.warning('Transaction flagged for review');
      }
    } catch (error) {
      toast.error('Failed to flag transaction: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  const handleReview = async (id: string) => {
    try {
      const transaction = (pendingTransactions || []).find(tx => tx.id === id);
      if (transaction) {
        setAnimationTransaction(transaction);
        setShowTransactionAnimation(true);
        await reviewTx(id);
        toast.info('Transaction marked for review');
      }
    } catch (error) {
      toast.error('Failed to mark transaction for review: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionDetailsOpen(true);
  };
  
  const handleOpenAddUserDialog = () => {
    setIsAddUserDialogOpen(true);
  };
  
  const handleCloseAddUserDialog = () => {
    setIsAddUserDialogOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserIsAdmin(false);
  };
  
  const handleAddUser = () => {
    addUser(newUserName, newUserEmail, newUserPassword, newUserIsAdmin);
    handleCloseAddUserDialog();
  };
  
  const handleOpenAdjustTrustDialog = (user: User) => {
    setSelectedUser(user);
    setIsAdjustTrustDialogOpen(true);
  };
  
  const handleCloseAdjustTrustDialog = () => {
    setIsAdjustTrustDialogOpen(false);
    setSelectedUser(null);
    setTrustPointsChange(0);
    setTrustPointsReason('');
  };
  
  const handleAdjustTrustPoints = () => {
    if (selectedUser) {
      adjustTrustPoints(selectedUser.id, trustPointsChange, trustPointsReason);
      handleCloseAdjustTrustDialog();
    }
  };
  
  const handleAnimationComplete = () => {
    setShowTransactionAnimation(false);
    setAnimationTransaction(null);
  };
  
  if (!isAuthenticated || !currentUser || currentUser.role !== 'admin') {
    return null;
  }
  
  if (isLoading) {
    return (
      <Dashboard>
        <div className="h-[80vh] flex items-center justify-center">
          <div className="text-2xl font-bold text-gradient animate-pulse">
            Loading admin panel...
          </div>
        </div>
      </Dashboard>
    );
  }
  
  return (
    <Dashboard>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </motion.div>
      
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="bg-background/50 backdrop-blur-sm">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-green-light/10">
            <History className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-green-light/10">
            <UsersRound className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-light/10">
            <BarChart3 className="mr-2 h-4 w-4" />
            System Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black p-6 rounded-2xl mb-6 shadow-xl">
            <CardHeader>
                <CardTitle>Transaction Management</CardTitle>
                <CardDescription>Review and manage all transactions in the system</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
                </div>
              
              <Table>
                  <TableCaption>A list of all transactions in the system.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Sender</TableHead>
                    <TableHead className="w-[150px]">Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => {
                        const senderUser = allUsers.find(u => u.email === transaction.sender || u.id === transaction.sender);
                        const recipientUser = allUsers.find(u => u.email === transaction.recipient || u.id === transaction.recipient);
                        return (
                          <TableRow key={transaction.id}>
                            <TableCell>{senderUser ? senderUser.name : transaction.sender}</TableCell>
                            <TableCell>{recipientUser ? recipientUser.name : transaction.recipient}</TableCell>
                            <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                transaction.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                                transaction.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                                transaction.status === 'flagged' ? 'bg-orange-900/30 text-orange-400' :
                                transaction.status === 'under_review' ? 'bg-blue-900/30 text-blue-400' :
                                'bg-yellow-900/30 text-yellow-400'
                              }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewTransactionDetails(transaction)}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              {transaction.status === 'pending' && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleApprove(transaction.id)}
                                          className="text-green-400 hover:text-green-300"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleReject(transaction.id)}
                                          className="text-red-400 hover:text-red-300"
                                        >
                                          <XCircle className="h-4 w-4" />
                                  </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleFlag(transaction.id)}
                                          className="text-orange-400 hover:text-orange-300"
                                        >
                                          <AlertTriangle className="h-4 w-4" />
                                  </Button>
                                      </>
                              )}
                                    {transaction.status === 'flagged' && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleReview(transaction.id)}
                                        className="text-blue-400 hover:text-blue-300"
                                      >
                                        <Clock className="h-4 w-4" />
                                      </Button>
                                    )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black p-6 rounded-2xl mb-6 shadow-xl">
            <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users and their trust scores</CardDescription>
                  </div>
                  <Button onClick={handleOpenAddUserDialog}>
                    Add User
                  </Button>
                </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                      <TableHead>Trust Score</TableHead>
                      <TableHead>Reputation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {allUsers.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-green-900/30 text-green-400'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{user.trustScore}</TableCell>
                        <TableCell>{user.reputation}</TableCell>
                      <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAdjustTrustDialog(user)}
                          >
                          Adjust Trust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-black p-6 rounded-2xl mb-6 shadow-xl">
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
                <CardDescription>Overview of system performance and trust network</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                  <CardHeader>
                      <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{(pendingTransactions || []).length}</div>
                  </CardContent>
                </Card>
                  <Card>
                  <CardHeader>
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{allUsers.length}</div>
                  </CardContent>
                </Card>
                  <Card>
                  <CardHeader>
                      <CardTitle className="text-sm font-medium">Trust Network Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{trustNetworkActivities.length}</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {/* Transaction Details Dialog */}
      <Dialog open={isTransactionDetailsOpen} onOpenChange={setIsTransactionDetailsOpen}>
        <DialogContent className="bg-black max-w-md p-8 rounded-2xl shadow-2xl border border-green-900">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Transaction ID</h4>
                <p className="text-sm text-white">{selectedTransaction.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Amount</h4>
                <p className="text-sm text-white">${selectedTransaction.amount.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-white">{selectedTransaction.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Timestamp</h4>
                <p className="text-sm text-white">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reject Transaction Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-black max-w-md p-8 rounded-2xl shadow-2xl border border-green-900">
          <DialogHeader>
            <DialogTitle>Reject Transaction</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="bg-black max-w-md p-8 rounded-2xl shadow-2xl border border-green-900">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={newUserIsAdmin}
                onChange={(e) => setNewUserIsAdmin(e.target.checked)}
              />
              <label htmlFor="isAdmin">Admin User</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddUserDialog}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Adjust Trust Points Dialog */}
      <Dialog open={isAdjustTrustDialogOpen} onOpenChange={setIsAdjustTrustDialogOpen}>
        <DialogContent className="bg-black max-w-md p-8 rounded-2xl shadow-2xl border border-green-900">
          <DialogHeader>
            <DialogTitle>Adjust Trust Points</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
              <Input
                type="number"
              placeholder="Trust points change"
                value={trustPointsChange}
              onChange={(e) => setTrustPointsChange(Number(e.target.value))}
              />
              <Input
              placeholder="Reason for adjustment"
                value={trustPointsReason}
                onChange={(e) => setTrustPointsReason(e.target.value)}
              />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAdjustTrustDialog}>
              Cancel
            </Button>
            <Button onClick={handleAdjustTrustPoints}>
              Adjust Trust Points
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transaction Animation */}
      <AnimatePresence>
        {showTransactionAnimation && animationTransaction && (
          <TransactionAnimation
            status={animationTransaction.status}
            amount={animationTransaction.amount}
            onComplete={handleAnimationComplete}
          />
        )}
      </AnimatePresence>
    </Dashboard>
  );
}
