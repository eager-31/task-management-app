import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { getTaskById, deleteTask } from "../api/taskApi";
import API from "../api/axios";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await getTaskById(id);
      setTask(data.task);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(id);
      toast.success("Task deleted successfully");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleViewDocument = async (doc) => {
    try {
      const response = await API.get(`/documents/${doc.id}`, {
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      window.open(fileURL, "_blank");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to open document");
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const response = await API.get(`/documents/${doc.id}`, {
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = doc.fileName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to download document");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!task) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        <p className="text-gray-600">Task not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-gray-100 p-4 md:p-8">
      <div className="bg-white rounded-xl shadow p-6 md:p-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Task Details</h1>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/tasks"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Back
            </Link>

            <Link
              to={`/tasks/edit/${task.id}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-gray-700">Title</h2>
            <p className="text-gray-900">{task.title}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Description</h2>
            <p className="text-gray-900">
              {task.description || "No description"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Status</h2>
            <p className="text-gray-900">{task.status}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Priority</h2>
            <p className="text-gray-900">{task.priority}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Due Date</h2>
            <p className="text-gray-900">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Created By</h2>
            <p className="text-gray-900">
              {task.createdBy?.email || "Unknown"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700">Assigned To</h2>
            <p className="text-gray-900">
              {task.assignedTo?.email || "Not assigned"}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Documents</h2>

            {task.documents?.length === 0 ? (
              <p className="text-gray-500">No documents uploaded</p>
            ) : (
              <div className="space-y-3">
                {task.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50 border rounded-lg p-3"
                  >
                    <span className="text-gray-800">{doc.fileName}</span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;