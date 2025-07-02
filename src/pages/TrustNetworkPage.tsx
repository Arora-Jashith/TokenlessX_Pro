import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/layout/Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { Progress } from '../components/ui/progress';
import { Card } from '../components/ui/card';
import { GlowingEffect } from '../components/ui/glowing-effect';
import TrustNetworkGraph from '../components/dashboard/TrustNetworkGraph';

export default function TrustNetworkPage() {
  const { currentUser, isAuthenticated, allUsers = [] } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!currentUser) {
    return null;
  }
  
  // Demo: Build nodes and links for the trust network graph
  const nodes = allUsers.map(u => ({
    id: u.id,
    name: u.name,
    trustScore: u.trustScore,
    isCurrentUser: currentUser && u.id === currentUser.id,
  }));
  // For demo, connect each user to 2 others randomly
  const links = allUsers.flatMap((u, i) => {
    const targets = allUsers.filter((_, j) => j !== i).slice(0, 2);
    return targets.map(t => ({ source: u.id, target: t.id, trust: Math.floor((u.trustScore + t.trustScore) / 2) }));
  });
  
  return (
    <Dashboard title="Trust Network">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trust Score Card */}
        <div className="relative rounded-2xl border border-green-700">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="bg-black p-6 rounded-2xl shadow-xl animate-scale-in col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white">Trust Score</h3>
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold text-white">{currentUser.trustScore}</div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" 
                  stroke="#2a2d3a" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" 
                  stroke="url(#trustGradient)" 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45 * currentUser.trustScore / 100} ${2 * Math.PI * 45}`}
                  strokeDashoffset={2 * Math.PI * 45 * 0.25}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6DE77B" />
                    <stop offset="100%" stopColor="#4CAF50" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mb-6">
            Your trust score is calculated based on your transaction history and network validation.
          </p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Network Validation</span>
                <span className="text-sm">{currentUser.trustNetworkStrength}%</span>
              </div>
              <Progress value={currentUser.trustNetworkStrength} className="h-2 [&>div]:bg-green-light" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Transaction Success</span>
                <span className="text-sm">{currentUser.transactionSuccessRate}%</span>
              </div>
              <Progress value={currentUser.transactionSuccessRate} className="h-2 [&>div]:bg-green-light" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Trust Points</span>
                <span className="text-sm">{currentUser.trustPoints} pts</span>
              </div>
              <Progress value={(currentUser.trustPoints / 200) * 100} className="h-2 [&>div]:bg-green-light" max={100} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Game Theory Principles Card */}
        <div className="relative rounded-2xl border border-green-700">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="bg-black p-6 rounded-2xl shadow-xl animate-scale-in col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white">Game Theory Principles</h3>
          
          <div className="space-y-4">
            <Card className="p-4 bg-secondary/50 border-none">
              <h4 className="font-semibold mb-1">Trust Network Validation</h4>
              <p className="text-sm text-muted-foreground">
                Transactions are validated by a decentralized network of trusted participants using game theory mechanics.
              </p>
            </Card>
            
            <Card className="p-4 bg-secondary/50 border-none">
              <h4 className="font-semibold mb-1">Reputation System</h4>
              <p className="text-sm text-muted-foreground">
                Your reputation score starts at 100 and changes based on your participation in successful transactions and validations.
              </p>
            </Card>
            
            <Card className="p-4 bg-secondary/50 border-none">
              <h4 className="font-semibold mb-1">Trust Points</h4>
              <p className="text-sm text-muted-foreground">
                Earn trust points by validating transactions and contributing to network security.
              </p>
            </Card>
            
            <Card className="p-4 bg-secondary/50 border-none">
              <h4 className="font-semibold mb-1">Network Protection</h4>
              <p className="text-sm text-muted-foreground">
                The system detects fraud attempts using game theory-based consensus mechanisms.
              </p>
            </Card>
            </div>
          </div>
        </div>
        
        {/* Trust Network Visualization */}
        <div className="bg-black p-6 rounded-2xl shadow-xl animate-scale-in col-span-full">
          <h3 className="text-xl font-bold mb-4 text-white">Trust Network Visualization (Live Demo)</h3>
          <div className="mb-8">
            <TrustNetworkGraph nodes={nodes} links={links} width={800} height={400} />
          </div>
          <h3 className="text-xl font-bold mb-4 text-white">Network Protection Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="p-4 bg-green-900/10 border border-green-500/20">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold">98.2%</div>
                  <div className="text-sm text-muted-foreground">Fraud Prevention Rate</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-green-900/10 border border-green-500/20">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold">527</div>
                  <div className="text-sm text-muted-foreground">Network Participants</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-green-900/10 border border-green-500/20">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold">25ms</div>
                  <div className="text-sm text-muted-foreground">Validation Speed</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
