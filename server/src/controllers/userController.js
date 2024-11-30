import User from '../models/User.js';

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude password field
      res.status(200).json({
        status: true,
        message: "Users retrieved successfully",
        data: users
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message || "Error retrieving users"
      });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const { userId } = req.params;
      const { isAdmin } = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { isAdmin },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }

      res.status(200).json({
        status: true,
        message: "User role updated successfully",
        data: user
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message || "Error updating user role"
      });
    }
  }
};

export default userController;