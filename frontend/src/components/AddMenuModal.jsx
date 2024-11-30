import{ useState } from 'react';
import axios from '../lib/axiosInstance';
import { toast } from 'react-hot-toast';

// eslint-disable-next-line react/prop-types
const AddMenuModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.post(
        'http://localhost:5000/api/menu/add-menu', 
        formDataToSend, 
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      
      toast.success('Menu item added successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add menu item');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuModal;