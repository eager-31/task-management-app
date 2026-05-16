import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { getTasks } from "../api/taskApi";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const data = await getTasks();
      const tasks = data.tasks || [];

      setStats({
        total: tasks.length,
        pending: tasks.filter((task) => task.status === "PENDING").length,
        inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
        completed: tasks.filter((task) => task.status === "COMPLETED").length,
        highPriority: tasks.filter((task) => task.priority === "HIGH").length,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-[90vh] bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Tasks
          </h2>
          <p className="text-4xl font-bold text-blue-600 mt-3">
            {stats.total}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Pending
          </h2>
          <p className="text-4xl font-bold text-yellow-600 mt-3">
            {stats.pending}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            In Progress
          </h2>
          <p className="text-4xl font-bold text-purple-600 mt-3">
            {stats.inProgress}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Completed
          </h2>
          <p className="text-4xl font-bold text-green-600 mt-3">
            {stats.completed}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            High Priority
          </h2>
          <p className="text-4xl font-bold text-red-600 mt-3">
            {stats.highPriority}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;