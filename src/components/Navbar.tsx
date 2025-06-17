
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 transition-all duration-300 ${
    isScrolled ? 'glass hercycle-shadow' : 'bg-transparent'
  }`;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-hercycle-deepPink font-semibold text-2xl">HerCycle</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground/80 hover:text-hercycle-deepPink transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex space-x-3">
            {user ? (
              <>
                <Button asChild variant="ghost" className="font-medium">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="font-medium"
                  onClick={() => signOut()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-medium">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-hercycle-deepPink hover:bg-hercycle-deepPink/90 text-white">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-background transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden pt-20`}
      >
        <div className="flex flex-col p-8 space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-foreground/80 hover:text-hercycle-deepPink transition-colors text-lg font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 flex flex-col space-y-3">
            {user ? (
              <>
                <Button asChild className="w-full">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button 
                  className="w-full"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full bg-hercycle-deepPink hover:bg-hercycle-deepPink/90 text-white">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
