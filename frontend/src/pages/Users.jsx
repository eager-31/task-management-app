import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  const [showForm, setShowForm] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "USER",
  });

  const inputClass =
    "w-full border border-gray-300 bg-white text-black placeholder-gray-400 rounded-lg px-4 py-2 [color-scheme:light] focus:outline-none focus:ring-2 focus:ring-blue-500";

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers({
        page,
        limit: 6,
      });

      setUsers(data.users || []);
      setPagination(data.pagination || { totalPages: 1, currentPage: 1 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      role: "USER",
    });
    setEditUserId(null);
    setShowForm(false);
  };

  const handleOpenCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEditForm = (user) => {
    setEditUserId(user.id);
    setFormData({
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (!editUserId && !formData.password) {
      toast.error("Password is required for new user");
      return;
    }

    if (!editUserId && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      if (editUserId) {
        const updateData = {
          email: formData.email,
          role: formData.role,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        await updateUser(editUserId, updateData);
        toast.success("User updated successfully");
      } else {
        await createUser(formData);
        toast.success("User created successfully");
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUserId);

      toast.success("User deleted successfully");
      setSelectedUserId(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <div className="min-h-[90vh] bg-gray-100 p-4 md:p-8">
      <div className="bg-white rounded-xl shadow p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Users Management
          </h1>

          <button
            onClick={handleOpenCreateForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create User
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmitUser}
            className="bg-gray-50 border rounded-xl p-4 mb-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-800">
              {editUserId ? "Edit User" : "Create User"}
            </h2>

            <div>
              <label className="block text-left text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block text-left text-gray-700 mb-1">
                Password {editUserId && "(leave blank to keep old password)"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-left text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                {editUserId ? "Update User" : "Save User"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Created At</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{user.id}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleOpenEditForm(user)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setSelectedUserId(user.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {users.length > 0 && (
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
            )}
          </>
        )}
      </div>

      {selectedUserId && (
        <ConfirmModal
          message="Are you sure you want to delete this user?"
          onConfirm={handleDelete}
          onCancel={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}

export default Users;