import User from "../models/user.js";


// CRUD operations

// function to get all users
export const getAllUsers = async (req, res) => {
    try {
        const user = await User.find()
        res.json({success: true, message: "Users fetched successfully", user})
    } catch (err) {
        res.status(500).json({success: false, message: err.message})
    }
}
// function to get one user
export const getOneUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById({_id: userId})
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }
        res.json({success: true, message: "User fetched successfully", user})
    } catch (err) {
        res.status(500).json({success: false, message: err.message})
    }
}
// function to update user
export const updateUser = async (req, res) => {
    try {
      const { _id } = req.user; 
      const { name, password, street, city, state, zip } = req.body; 
      const imageFile = req.file; 

      console.log(_id);
  
      const user = await User.findById(_id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User Not Found" });
      }
  
      const updateUserData = {
        name: name || user.name,
        address: {
          street: street || user.address.street,
          city: city || user.address.city,
          state: state || user.address.state,
          zip: zip || user.address.zip
        }
      };
  
      if (imageFile) {
        // Delete image from cloudinary
        if (user.image && user.imagePublicId) {
          await cloudinary.uploader.destroy(user.imagePublicId);
        }
        // upload new image to cloudinaryu
        const imageResult = await cloudinary.uploader.upload(imageFile.path);
        updateUserData.image = imageResult.secure_url;
        updateUserData.imagePublicId = imageResult.public_id;
      }
  
      // Update user data
      const updatedUser = await User.findByIdAndUpdate(_id, updateUserData, {
        new: true,
      });
  
      return res.json({
        success: true,
        message: "User Profile updated successfully",
        updatedUser,
      });
    } catch (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ success: false, message: "Failed to update user profile", error: err });
    }
  };
  
// function to delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.deleteOne({_id: userId})
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }
        res.json({success: true, message: "User deleted successfully", user})
    } catch (err) {
        console.log("Error deleting user", err.message)
        res.status(500).json({success: false, error: "Internal server error", message: err.message})
    }
}

export default {getAllUsers, getOneUser, deleteUser, updateUser}