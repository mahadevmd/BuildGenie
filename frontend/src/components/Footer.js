import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BuildGenie</h3>
            <p className="text-gray-300">
              Your ultimate PC building assistant. Create custom builds or choose from our pre-configured options.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/builder" className="text-gray-300 hover:text-primary transition-colors">PC Builder</Link></li>
              <li><Link to="/gaming-build" className="text-gray-300 hover:text-primary transition-colors">Gaming Builds</Link></li>
              <li><Link to="/saved-builds" className="text-gray-300 hover:text-primary transition-colors">Saved Builds</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300">
              Email: info@buildgenie.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BuildGenie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;