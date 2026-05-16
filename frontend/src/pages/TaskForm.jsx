import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask, getTaskById, updateTask } from "../api/taskApi";
import { getUsers } from "../api/userApi";

function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: "",
    assignedTo: "",
    documents: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full border border-gray-300 bg-white text-black placeholder-gray-400 rounded-lg px-4 py-2 [color-scheme:light] focus:outline-none focus:ring-2 focus:ring-blue-500";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      setError("You can upload maximum 3 PDF documents");
      return;
    }

    const invalidFile = files.find(
      (file) => file.type !== "application/pdf"
    );

    if (invalidFile) {
      setError("Only PDF files are allowed");
      return;
    }

    setFormData({
      ...formData,
      documents: files,
    });

    setError("");
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    }
  };

  const fetchTask = async () => {
    try {
      setLoading(true);

      const data = await getTaskById(id);
      const task = data.task;

      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "PENDING",
        priority: task.priority || "MEDIUM",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        assignedTo: task.assignedToId || "",
        documents: [],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    if (isEditMode) {
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description || !formData.dueDate) {
      setError("Title, description and due date are required");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        const updateData = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate,
          assignedToId: formData.assignedTo || null,
        };

        await updateTask(id, updateData);
        toast.success("Task updated successfully");
      } else {
        const taskData = new FormData();

        taskData.append("title", formData.title);
        taskData.append("description", formData.description);
        taskData.append("status", formData.status);
        taskData.append("priority", formData.priority);
        taskData.append("dueDate", formData.dueDate);

        if (formData.assignedTo) {
          taskData.append("assignedToId", formData.assignedTo);
        }

        formData.documents.forEach((file) => {
          taskData.append("documents", file);
        });

        await createTask(taskData);
        toast.success("Task created successfully");
      }

      navigate("/tasks");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          (isEditMode ? "Task update failed" : "Task creation failed")
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <p className="text-gray-600">Loading task...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gray-100 p-4 md:p-8">
      <div className="bg-white rounded-xl shadow p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Edit Task" : "Create Task"}
        </h1>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-left text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-left text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClass}
              rows="4"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-left text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-left text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-left text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-left text-gray-700 mb-1">
              Assigned To
            </label>

            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Not Assigned</option>

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} - {user.role}
                </option>
              ))}
            </select>

            {users.length === 0 && (
              <p className="text-sm text-gray-500 mt-1 text-left">
                User list is visible only for admin.
              </p>
            )}
          </div>

          {!isEditMode && (
            <div>
              <label className="block text-left text-gray-700 mb-1">
                Attach PDF Documents (Max 3)
              </label>

              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
                className={inputClass}
              />
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 pt-2">
            <button
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Task"
                : "Save Task"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;