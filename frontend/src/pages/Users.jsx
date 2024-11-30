import { useState, useEffect } from 'react';
import axios from '../lib/axiosInstance';
import { toast } from 'react-hot-toast';
import { UserIcon, ShieldCheckIcon, ShieldIcon } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('users/getAllUsers');
      setUsers(response.data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    try {
      await axios.put(`users/updateRole/${userId}`, {
        isAdmin: !currentRole
      });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
          </div>

          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.isAdmin
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                  
                  <button
                    onClick={() => handleRoleChange(user._id, user.isAdmin)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.isAdmin
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                    }`}
                    title={user.isAdmin ? 'Remove admin rights' : 'Make admin'}
                  >
                    {user.isAdmin ? (
                      <ShieldIcon className="h-5 w-5" />
                    ) : (
                      <ShieldCheckIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="p-12 text-center">
              <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">No users have been registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;