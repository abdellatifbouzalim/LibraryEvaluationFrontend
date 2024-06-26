import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserService from '../../Services/UserService';
import AddUserModal from './AddUserModal';
import { showToastError, showToastInfo, showToastSuccess } from '../../core/utils/Toasts';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editedUserId, setEditedUserId] = useState<number | null>(null);
  const [editedUsername, setEditedUsername] = useState<string>('');
  const [editedEmail, setEditedEmail] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await UserService.getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        showToastError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (id: number, username: string, email: string) => {
    setEditedUserId(id);
    setEditedUsername(username);
    setEditedEmail(email);
  };

  const handleDelete = async (id: number) => {
    try {
      await UserService.deleteUser(id);
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      showToastSuccess('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToastError('Failed to delete user');
    }
  };

  const handleCancelEdit = () => {
    setEditedUserId(null);
    setEditedUsername('');
    setEditedEmail('');
    showToastInfo('Edit canceled');
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await UserService.updateUser(id, { username: editedUsername, email: editedEmail });
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          return { ...user, username: editedUsername, email: editedEmail };
        }
        return user;
      });
      setUsers(updatedUsers);
      setEditedUserId(null);
      setEditedUsername('');
      setEditedEmail('');
      showToastSuccess('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      showToastError(`Failed to update user. ${error}`);
    }
  };

  return (
    <div className="mx-auto">
      <div className="overflow-x-auto">
        <AddUserModal />
        <table className="table-auto min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden border border-purple-700">
          <thead className="bg-purple-700 text-white ">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Username
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editedUserId === user.id ? (
                    <input
                      type="text"
                      value={editedUsername}
                      onChange={e => setEditedUsername(e.target.value)}
                      className="border border-gray-300 px-3 py-1"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editedUserId === user.id ? (
                    <input
                      type="text"
                      value={editedEmail}
                      onChange={e => setEditedEmail(e.target.value)}
                      className="border border-gray-300 px-3 py-1"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {editedUserId === user.id ? (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
                        onClick={() => handleSaveEdit(user.id)}
                      >
                        <FontAwesomeIcon icon={faSave} /> Save
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
                        onClick={handleCancelEdit}
                      >
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                      onClick={() => handleEdit(user.id, user.username!, user.email!)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 ? (
          <p className="text-center text-red-500">Users Table is empty !!</p>
        ) : (   <p></p>)}
      </div>
    </div>
  );
};

export default UserList;
