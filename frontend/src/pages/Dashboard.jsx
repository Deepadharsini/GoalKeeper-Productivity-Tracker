import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">GoalKeeper</h1>
              </div>
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
            <div className="flex items-center">
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
