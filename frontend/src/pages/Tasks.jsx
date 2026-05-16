import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import { getTasks } from "../api/taskApi";
import socket from "../socket";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  const inputClass =
    "w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg px-4 py-2 [color-scheme:light] focus:outline-none focus:ring-2 focus:ring-blue-500";

  const selectClass =
    "w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-2 [color-scheme:light] focus:outline-none focus:ring-2 focus:ring-blue-500";

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks({
        search,
        status,
        priority,
        sortBy: sortBy || "createdAt",
        order: "desc",
        page,
        limit: 6,
      });

      setTasks(data.tasks || []);
      setPagination(data.pagination || { totalPages: 1, currentPage: 1 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [search, status, priority, sortBy, page]);

  useEffect(() => {
    const handleRealtimeUpdate = () => {
      fetchTasks();
    };

    socket.on("taskCreated", handleRealtimeUpdate);
    socket.on("taskUpdated", handleRealtimeUpdate);
    socket.on("taskDeleted", handleRealtimeUpdate);

    return () => {
      socket.off("taskCreated", handleRealtimeUpdate);
      socket.off("taskUpdated", handleRealtimeUpdate);
      socket.off("taskDeleted", handleRealtimeUpdate);
    };
  }, [search, status, priority, sortBy, page]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setSortBy("");
    setPage(1);
  };

  return (
    <div className="min-h-[90vh] bg-gray-100 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>

        <Link
          to="/tasks/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
        >
          Create Task
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={inputClass}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={status}
            onChange={(e) => handleFilterChange(setStatus, e.target.value)}
            className={selectClass}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => handleFilterChange(setPriority, e.target.value)}
            className={selectClass}
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
            className={selectClass}
          >
            <option value="">Sort By</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={handleClearFilters}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center text-gray-600">
          No tasks found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Tasks;