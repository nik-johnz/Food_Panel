import { useState, useEffect } from "react";
import useAuth from "../contexts/AuthContext";
import axios from "../lib/axiosInstance";
import { toast } from "react-hot-toast";
import EditMenuModal from "../components/EditModal";
import AddMenuModal from "../components/AddMenuModal";
import DeleteMenuModal from "../components/DeleteModal";
import { Plus as PlusIcon, Image as ImageIcon, Pencil as PencilIcon, Trash as TrashIcon, Package as EmptyIcon } from 'lucide-react';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get("/menu/getItems");
      console.log(response.data.data);
      setMenuItems(response.data.data);
    } catch (err) {
      console.err(err);
      toast.error("Failed to load menu items");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/menu/categories");
      setCategories(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  const filteredMenu =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
    <div className="container mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Menu</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated selection of delicious dishes
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
        <div className="w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                       text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Item
          </button>
        )}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMenu.map((item) => (
          <div 
            key={item._id} 
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 
                       overflow-hidden transform hover:-translate-y-1"
          >
            <div className="relative h-64">
              {item.image ? (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-purple-600">
                  ${item.price}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <span className="px-3 py-1 bg-purple-50 rounded-full text-sm font-medium text-purple-600">
                  {item.category}
                </span>
              </div>

              <p className="text-gray-600 mb-6 line-clamp-2">{item.description}</p>

              {isAdmin && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedItemId(item._id);
                      setEditModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 
                              transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(item);
                      setDeleteModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 
                              transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMenu.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <EmptyIcon className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No menu items found</h3>
          <p className="text-gray-500">Try selecting a different category or add new items</p>
        </div>
      )}

      {/* Modals */}
      <AddMenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMenu}
      />
      <EditMenuModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedItemId(null);
        }}
        onSuccess={fetchMenu}
        itemId={selectedItemId}
      />
      <DeleteMenuModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onSuccess={fetchMenu}
        item={itemToDelete}
      />
    </div>
  </div>
  );
};

export default Home;
