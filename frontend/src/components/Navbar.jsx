import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { removeUser } from '../features/user/userSlice';
import potato from '../images/potato.png';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [menuItems, setMenuItems] = React.useState([]);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Base menu items
  const baseMenuItems = [
    { name: 'Home', href: './' },
    { name: 'About', href: '#' },
  ];

  const updateMenuItems = useCallback(() => {
    let updatedItems = [...baseMenuItems];
    
    if (user?.role === 'USER') {
      updatedItems.push({ name: 'Profile', href: './user' });
    } else if (user?.role === 'ADMIN') {
      updatedItems.push({ name: 'Admin', href: './admin' });
    }
    
    setMenuItems(updatedItems);
  }, [user]);

  useEffect(() => {
    updateMenuItems();
  }, [user, updateMenuItems]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleSignOut = () => {
    dispatch(removeUser());
    navigate('/', { replace: true });
  };

  return (
    <nav className="sticky top-6 z-20 w-full max-w-7xl mx-auto px-4 navbar-container" aria-label="Main navigation">
      <div className="relative bg-gradient-to-r from-gray-900 to-black text-white rounded-full mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 shadow-xl">
        {/* Logo and Brand */}
        <Link to="/" className="inline-flex items-center space-x-2 hover:opacity-90 transition-opacity duration-200">
          <img 
            className="w-12 h-12 drop-shadow-md" 
            src={potato} 
            alt="Rotten Potato Logo"
          />
          <span className="font-bold text-lg text-red-50">Rotten Potato</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <ul className="inline-flex items-center space-x-8" role="menubar">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none">
                <Link
                  to={item.href}
                  className={`text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-md
                    ${location.pathname === item.href 
                      ? 'text-white bg-gradient-to-r from-red-800 to-red-900 shadow-md' 
                      : 'text-red-300 hover:text-red-200 hover:bg-red-950'
                    }`}
                  role="menuitem"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-2">
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="transition-all duration-200 rounded-md bg-gradient-to-r from-red-800 to-red-900 px-4 py-2 text-sm font-semibold text-red-50 shadow-md hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-red-900"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex shadow-md">
              <Link to="/Sign-in">
                <button
                  type="button"
                  className="transition-all duration-200 rounded-l-md bg-gradient-to-r from-red-700 to-red-800 px-4 py-2 text-sm font-semibold text-red-50 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-red-900"
                >
                  Sign In
                </button>
              </Link>
              <Link to="/Sign-up">
                <button
                  type="button"
                  className="transition-all duration-200 rounded-r-md bg-gradient-to-r from-red-800 to-red-900 px-4 py-2 text-sm font-semibold text-red-50 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-red-900"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-red-100 hover:bg-red-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 w-full mt-2 origin-top-right rounded-lg bg-gradient-to-b from-gray-900 to-black shadow-xl ring-1 ring-red-900 lg:hidden">
            <div className="px-4 py-3 divide-y divide-red-900/30">
              <div className="space-y-2">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.href}
                    className="block px-4 py-2 text-sm text-red-200 rounded-md hover:bg-red-900/50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-3">
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-200 hover:bg-red-900/50 rounded-md transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/Sign-in"
                      className="block px-4 py-2 text-sm text-red-200 hover:bg-red-900/50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/Sign-up"
                      className="block px-4 py-2 text-sm text-red-200 hover:bg-red-900/50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}