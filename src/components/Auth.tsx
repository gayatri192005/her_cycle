
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const Auth: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
        navigate('/login');
      }
    } catch (error) {
      // Error is handled in the Auth context
      console.error('Authentication error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <Link to="/" className="inline-block">
          <h2 className="text-hercycle-deepPink text-3xl font-bold">HerCycle</h2>
        </Link>
        <h3 className="text-2xl font-semibold mt-6 mb-2">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h3>
        <p className="text-foreground/70">
          {mode === 'login' 
            ? 'Enter your details to access your account' 
            : 'Start tracking your cycle with precision'
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in animate-delay-100">
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="pl-10 py-6"
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="pl-10 py-6"
              required
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
              <Mail size={18} />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === 'login' && (
              <Link to="/forgot-password" className="text-sm text-hercycle-deepPink hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'login' ? "Enter your password" : "Create a password"}
              className="pl-10 pr-10 py-6"
              required
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
              <Lock size={18} />
            </div>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground/90"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-hercycle-deepPink hover:bg-hercycle-deepPink/90 py-6 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {mode === 'login' ? 'Logging in...' : 'Creating account...'}
            </div>
          ) : (
            mode === 'login' ? 'Log in' : 'Create account'
          )}
        </Button>
      </form>
      
      <div className="mt-8 text-center animate-fade-in animate-delay-200">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-foreground/60">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="outline" className="w-full py-6 relative" type="button">
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm animate-fade-in animate-delay-300">
        <span className="text-foreground/70">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        </span>
        <Link 
          to={mode === 'login' ? '/register' : '/login'} 
          className="text-hercycle-deepPink font-medium hover:underline"
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </Link>
      </div>
    </div>
  );
};

export default Auth;
