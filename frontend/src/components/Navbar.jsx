import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        TaskManager
      </Link>

      <div className="flex gap-4 items-center">
        {token ? (
          <>
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>

            <Link to="/tasks" className="text-gray-700 hover:text-blue-600">
              Tasks
            </Link>

            {user?.role === "ADMIN" && (
              <Link to="/users" className="text-gray-700 hover:text-blue-600">
                Users
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>

            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;