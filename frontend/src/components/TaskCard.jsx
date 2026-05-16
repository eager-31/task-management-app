import { Link } from "react-router-dom";

function TaskCard({ task }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {task.title}
      </h2>

      <p className="text-gray-600 mb-4">
        {task.description || "No description"}
      </p>

      <p className="text-sm mb-1">
        <span className="font-semibold">Status:</span> {task.status}
      </p>

      <p className="text-sm mb-1">
        <span className="font-semibold">Priority:</span> {task.priority}
      </p>

      <p className="text-sm mb-4">
        <span className="font-semibold">Due Date:</span>{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
      </p>

      <Link
        to={`/tasks/${task.id}`}
        className="text-blue-600 font-medium hover:underline"
      >
        View Details
      </Link>
    </div>
  );
}

export default TaskCard;