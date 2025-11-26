import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref to detect outside clicks for the dropdown
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Effect to handle clicking outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <header className="bg-transparent backdrop-blur-sm text-white sticky top-0 z-50 border-b border-primary/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-2xl font-bold font-heading">BuildGenie</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-primary transition-all duration-300">Home</Link>
          <Link to="/builder" className="hover:text-primary transition-all duration-300">PC Builder</Link>
          <Link to="/saved-builds" className="hover:text-primary transition-all duration-300">Saved Builds</Link>
          <Link to="/recommendations" className="hover:text-primary transition-all duration-300">Recommendations</Link>
          
          {/* Dropdown Menu logic is now controlled by state */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown} 
              className="hover:text-primary transition-all duration-300 flex items-center"
            >
              Pre-Built PCs
              <svg className={`w-4 h-4 ml-1 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Conditional rendering based on isDropdownOpen state */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-dark-light rounded-md shadow-lg py-1 z-10 border border-primary/20">
                <Link to="/gaming-build" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-white hover:bg-primary/10 transition-all duration-300">Gaming Builds</Link>
                <Link to="/budget-build" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-white hover:bg-primary/10 transition-all duration-300">Budget Builds</Link>
                <Link to="/office-build" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-white hover:bg-primary/10 transition-all duration-300">Office Builds</Link>
                <Link to="/workstation-build" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-white hover:bg-primary/10 transition-all duration-300">Workstation Builds</Link>
              </div>
            )}
          </div>
          
          {/* Authentication Links */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <span className="text-primary">{currentUser.username}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => logout()}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="hover:text-primary transition-all duration-300">Login</Link>
              <Link to="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-light backdrop-blur-sm border-t border-primary/10">
          <div className="container mx-auto px-4 py-2">
            <Link to="/" className="block py-2 hover:text-primary transition-all duration-300" onClick={toggleMenu}>Home</Link>
            <Link to="/builder" className="block py-2 hover:text-primary transition-all duration-300" onClick={toggleMenu}>PC Builder</Link>
            <Link to="/saved-builds" className="block py-2 hover:text-primary transition-all duration-300" onClick={toggleMenu}>Saved Builds</Link>
            <Link to="/recommendations" className="block py-2 hover:text-primary transition-all duration-300" onClick={toggleMenu}>Recommendations</Link>
            <div className="py-2">
              <p className="text-muted-foreground text-sm mb-1">Pre-Built PCs</p>
              <Link to="/gaming-build" className="block py-1 pl-4 hover:text-primary transition-all duration-300" onClick={toggleMenu}>Gaming Builds</Link>
              <Link to="/budget-build" className="block py-1 pl-4 hover:text-primary transition-all duration-300" onClick={toggleMenu}>Budget Builds</Link>
              <Link to="/office-build" className="block py-1 pl-4 hover:text-primary transition-all duration-300" onClick={toggleMenu}>Office Builds</Link>
              <Link to="/workstation-build" className="block py-1 pl-4 hover:text-primary transition-all duration-300" onClick={toggleMenu}>Workstation Builds</Link>
            </div>
            
            {/* Mobile Authentication Links */}
            <div className="py-2 border-t border-gray-700 mt-2">
              {currentUser ? (
                <>
                  <p className="text-muted-foreground text-sm mb-1">Account</p>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-primary">{currentUser.username}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-sm mb-1">Account</p>
                  <Link to="/login" className="block py-1 pl-4 hover:text-primary" onClick={toggleMenu}>Login</Link>
                  <Link to="/register" className="block py-1 pl-4 hover:text-primary" onClick={toggleMenu}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
