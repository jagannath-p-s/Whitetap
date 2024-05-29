import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/whitetap/whitetap.png';
import { FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [top, setTop] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top && 'bg-white backdrop-blur-sm shadow-lg'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Site branding */}
          <div className="flex-shrink-0 mr-4">
            {/* Logo */}
            <Link to="/" className="block" aria-label="White Tap">
              <img className="md:w-48 w-36" src={Logo} alt="Logo" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              aria-label="Toggle Menu"
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Site navigation */}
          <nav className="hidden md:flex md:flex-grow justify-end items-center space-x-6">
            <ul className="md:flex md:flex-grow justify-end items-center space-x-6">
              <li>
                <Link
                  to="/signin"
                  className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3 px-5 py-3 rounded-full transition duration-150 ease-in-out flex items-center"
                >
                  <span>Sign up</span>
                  <svg
                    className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                      fillRule="nonzero"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40  bg-opacity-75 transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex justify-between -mt-14 items-center p-4">
          <Link to="/" className="block" aria-label="White Tap">
            <img className="w-36" src={Logo} alt="Logo" />
          </Link>
          <button
            aria-label="Close Menu"
            className="text-gray-600 mr-2 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>
        <ul className="p-6 space-y-4">
          <li className='flex justify-center'>
            <Link
              to="/signin"
              className="text-black  font-semibold hover:text-gray-900 flex items-center"
              onClick={() => setSidebarOpen(false)}
            >
              Sign in
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 px-5 py-3 rounded-full transition duration-150 ease-in-out flex items-center"
              onClick={() => setSidebarOpen(false)}
            >
              <span>Sign up</span>
              <svg
                className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1"
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                  fillRule="nonzero"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
