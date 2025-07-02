import { ReactNode, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Home, History, Users, Shield, Menu, Wallet } from 'lucide-react';
import { Button } from '../ui/button';
import { Banner } from '../ui/banner';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '../ui/sheet';
import { GlowingEffect } from '../ui/glowing-effect';
import { ThemeToggle } from '../ui/theme-toggle';

interface DashboardProps {
  children: ReactNode;
  title?: string;
}

export default function Dashboard({ children, title }: DashboardProps) {
  const { logout, currentUser, isAdmin, pendingTransactions } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Real-time pending approvals count
  const pendingApprovalsCount = useMemo(() => {
    if (!currentUser) return 0;
    return pendingTransactions.filter(tx => tx.status === 'pending' && tx.sender === currentUser.email).length;
  }, [pendingTransactions, currentUser]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col relative overflow-x-hidden">
      {/* Banner for announcements */}
      {currentUser.role === 'admin' && (
        <Banner
          id="admin-banner"
          message="🔐 Administrator Mode - You have full system access"
          variant="rainbow"
          height="2rem"
        />
      )}
      
      {/* Top Navigation */}
      <header className="bg-white dark:bg-black border-b border-green-700 p-4 sticky top-0 z-20 rounded-b-2xl transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-green-400 drop-shadow-lg">TokenlessX</div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-foreground hover:text-primary hover:bg-green-900/20 flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/transaction-history')}
              className="text-foreground hover:text-primary hover:bg-green-900/20 flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Transactions
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/trust-network')}
              className="text-foreground hover:text-primary hover:bg-green-900/20 flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Trust Network
            </Button>
            {isAdmin && (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin')}
                className="text-foreground hover:bg-yellow-900/30 hover:text-yellow-400 flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Button>
            )}
          </nav>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout} className="hidden md:flex items-center border-green-light/30 hover:bg-green-900/20 hover:text-green-light">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-green-light/30">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col gap-4 pt-8">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/dashboard')}
                      className="justify-start"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/transaction-history')}
                      className="justify-start"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Transaction History
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/trust-network')}
                      className="justify-start"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Trust Network
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate('/admin')}
                        className="justify-start"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="mt-4"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-10 flex-grow">
        {/* User Profile Card */}
        <div className="relative rounded-2xl border border-green-700 mb-8">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="bg-white dark:bg-black p-8 rounded-2xl animate-fade-in shadow-xl shadow-black/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 rounded-full bg-green-900 flex items-center justify-center text-3xl font-bold mr-6 shadow-lg shadow-green-400/10 text-green-400">
                  {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">Welcome, {currentUser.name}</h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Reputation: {currentUser.reputation}
                  </span>
                  <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Trust Score: {currentUser.trustScore}
                  </span>
                  <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      {pendingApprovalsCount} Pending Approvals
                  </span>
                  {isAdmin && (
                    <span className="bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center">
                <div className="bg-green-900 p-5 rounded-xl shadow-inner flex flex-col items-end min-w-[180px]">
                  <div className="text-sm text-green-300">Balance</div>
                  <div className="flex items-center gap-2 text-3xl font-bold text-green-400">
                    <Wallet className="w-7 h-7 text-green-400" />
                    ${currentUser.balance.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <main>
          {title && <h2 className="text-2xl font-bold mb-8 text-black dark:text-white">{title}</h2>}
          {children}
        </main>
      </div>
      
      {/* Footer */}
      <footer className="mt-0 py-8 bg-white dark:bg-black border-t border-green-700 rounded-t-2xl transition-all duration-300">
        <div className="container mx-auto text-center text-green-700">
          <p>© 2025 TokenlessX - Game Theory-based Trust Network</p>
        </div>
      </footer>
    </div>
  );
}
