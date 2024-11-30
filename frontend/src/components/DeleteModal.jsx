/* eslint-disable react/prop-types */
import toast from 'react-hot-toast';
import axios from '../lib/axiosInstance';


const DeleteMenuModal = ({ isOpen, onClose, onSuccess, item }) => {
    const handleDelete = async () => {
      try {
        await axios.delete(`/menu/delete/${item._id}`);
        toast.success("Menu item deleted");
        onSuccess();
        onClose();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete menu item");
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">Delete Menu Item</h2>
          
          <div className="mb-6">
            <p className="text-gray-600">
              Are you sure you want to delete `{item?.name}`? This action cannot be undone.
            </p>
          </div>
  
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteMenuModal;