import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useState } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/goalkeeper.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.8'
        }}
      />

      {/* Animated Welcome Text */}
      <div className="absolute right-48 top-1/2 transform -translate-y-1/2 z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug">
          {/* Welcome to */}
          <span className="text-yellow-500 block animate-pulse">Welcome to</span>

          {/* GOALKEEPER with left-to-right animation */}
          <span
            className="text-purple-900 block mt-2 inline-block"
            style={{
              animation: 'move-left-right 2s ease-in-out infinite alternate',
              display: 'inline-block',
            }}
          >
            GOALKEEPER
          </span>
        </h1>

        {/* Productivity made simple */}
        <p
          className="text-lg text-black mt-4 italic"
          style={{
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Productivity made simple
        </p>

        {/* Inline Keyframes */}
        <style>
          {`
            @keyframes move-left-right {
              0% { transform: translateX(-10px); }
              100% { transform: translateX(10px); }
            }
          `}
        </style>
      </div>

      {/* Goal GIF Overlay */}
      <div className="fixed bottom-4 right-4 z-10">
        <img 
          src="/goal.gif" 
          alt="Goal Animation" 
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">GoalKeeper</h1>
              </div>
              {/* Mobile menu button */}
              <div className="sm:hidden ml-4">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Desktop menu */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard/goals"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500"
                >
                  Goals
                </Link>
                <Link
                  to="/dashboard/habits"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500"
                >
                  Habits
                </Link>
                <Link
                  to="/dashboard/chart"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500"
                >
                  Progress
                </Link>
                <Link
                  to="/dashboard/reminders"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500"
                >
                  Reminders
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard/profile"
                  className="flex items-center"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user?.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'default'}`}
                    alt={user?.name}
                  />
                  <span className="ml-2 text-gray-700">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} absolute top-16 left-0 right-0 bg-white shadow-lg`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard/goals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Goals
            </Link>
            <Link
              to="/dashboard/habits"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Habits
            </Link>
            <Link
              to="/dashboard/chart"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Progress
            </Link>
            <Link
              to="/dashboard/reminders"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reminders
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'default'}`}
                    alt={user?.name}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-20">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
