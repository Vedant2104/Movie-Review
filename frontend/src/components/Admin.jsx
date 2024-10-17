import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8002/api/profile/admin',
          { withCredentials: true }
        );
        console.log(response.data);
        setUsers(response.data.allUser);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);


  const handleRoleChange = (id, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, role: newRole } : user
      )
    );
  };

  // Save the updated user role via POST request
  const handleSave = async (user) => {
    try {
      await axios.post(
        'http://localhost:8002/api/user/change-role',
        { id: user._id, role: user.role }, // Posting user ID and new role
        { withCredentials: true }
      );
      
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role.');
    }
  };

  return (
    <div className="text-gray-900 bg-gray-200 min-h-screen">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl">Users</h1>
      </div>

      {/* Table Container */}
      <div className="px-3 py-4 flex justify-center">
        <table className="w-full text-md bg-white shadow-md rounded mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 px-5">Name</th>
              <th className="text-left p-3 px-5">Email</th>
              <th className="text-left p-3 px-5">Role</th>
              <th className="p-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-orange-100 bg-gray-100"
                >
                  <td className="p-3 px-5">
                    <input
                      type="text"
                      value={user.fullName}
                      readOnly
                      className="bg-transparent border-b-2 border-gray-300 py-2 w-full"
                    />
                  </td>
                  <td className="p-3 px-5">
                    <input
                      type="text"
                      value={user.email}
                      readOnly
                      className="bg-transparent border-b-2 border-gray-300 py-2 w-full"
                    />
                  </td>
                  <td className="p-3 px-5">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="bg-transparent border-b-2 border-gray-300 py-2 w-full"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-3 px-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSave(user)}
                      className="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
