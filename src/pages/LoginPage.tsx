import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MoveRight } from 'lucide-react';
import { AsyncSelect } from '../components/ui/async-select';
import { User } from '../types/user';
import { toast } from '../components/ui/use-toast';
import GlobeDemo from '../components/ui/globe-demo';
import Navigation from '../components/Navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, allUsers } = useAuth();

  // For the quick login selector
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (selectedUserId) {
      const selectedUser = allUsers?.find(user => user.id === selectedUserId);
      if (selectedUser) {
        setEmail(selectedUser.email);
        setPassword("password"); // Assuming all test accounts have the same password
      }
    }
  }, [selectedUserId, allUsers]);

  // Mock function to fetch users for AsyncSelect
  const fetchUsers = async (query?: string): Promise<User[]> => {
    // In a real app, this would be an API call
    if (!allUsers) return [];
    
    if (!query) return allUsers;
    
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(query?.toLowerCase() || '') ||
      user.email.toLowerCase().includes(query?.toLowerCase() || '') ||
      user.role?.toLowerCase().includes(query?.toLowerCase() || '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      toast({ title: "Login successful" });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to log in');
      }
    }
  };

  const handleQuickLogin = (userId: string) => {
    setSelectedUserId(userId);
    const selectedUser = allUsers?.find(user => user.id === userId);
    if (selectedUser) {
      setEmail(selectedUser.email);
      // Use the actual password from mock data
      const password = selectedUser.password;
      setPassword(password);
      setTimeout(async () => {
        try {
          await login(selectedUser.email, password);
          toast({ title: "Login successful" });
          navigate('/dashboard');
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to log in');
          }
        }
      }, 100);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-background p-4">
        {/* Left: Globe */}
        <div className="hidden md:flex w-full md:w-1/2 h-full items-center justify-center">
          <GlobeDemo />
        </div>
        {/* Divider */}
        <div className="hidden md:block h-[60vh] w-px bg-muted mx-8 rounded-full" />
        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <Link to="/" className="mb-8 text-sm text-muted-foreground hover:text-primary transition-colors">
            &larr; Back to Landing Page
          </Link>
          <div className="w-full max-w-md glass-card p-8 rounded-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gradient mb-2">TokenlessX</h1>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6">
                {error}
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quick Access</label>
              <AsyncSelect<User>
                fetcher={fetchUsers}
                renderOption={(user) => (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-light/30 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email} {user.role === 'admin' ? '(Admin)' : ''}</div>
                    </div>
                  </div>
                )}
                getOptionValue={(user) => user.id}
                getDisplayValue={(user) => (
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-6 h-6 rounded-full bg-green-light/30 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                )}
                notFound={<div className="py-6 text-center text-sm">No users found</div>}
                label="User"
                placeholder="Select a user to login..."
                value={selectedUserId}
                onChange={handleQuickLogin}
                width="100%"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full bg-green-light text-black hover:bg-green-light/90">
                Sign In <MoveRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-light hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground max-w-md">
            By signing in, you agree to our Terms of Service and Privacy Policy. TokenlessX uses game theory principles for trust-based transactions.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
