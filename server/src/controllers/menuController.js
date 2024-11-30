import Menu from '../models/Menu.js'; 
import fs from 'fs';
import path from 'path';

const menuController = { 
        addMenuItem : async (req, res) => {
        try { 
      
          const { name, description, price, category } = req.body;
          const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      
          const menuItem = new Menu({
            name,
            description,
            price: parseFloat(price),
            category,
            image: imagePath
          });
      
          await menuItem.save();
          res.status(201).json({
            status: true,
            message: 'Menu item added successfully',
            data: menuItem
          });
        } catch (err) {
          res.status(500).json({
            status: false,
            message: err.message || 'Error adding menu item'
          });
        }
      } ,
      getAllItems : async(req,res)=>{ 
        try{

          const menuItems = await Menu.find({}) 
          return res.status(200).json({ status : true , message : "data fetched successfully " , data : menuItems}) ; 

        }catch(err){
          console.error(err)
        }
      }  ,
      getItemById: async (req, res) => {
        try {
          const { id } = req.params;
      
          // Find the item by ID
          const menuItem = await Menu.findById(id);
      
          // Handle item not found
          if (!menuItem) {
            return res.status(404).json({
              status: false,
              message: "Item not found",
            });
          }
      
          
          return res.status(200).json({
            status: true,
            message: "Item found",
            data: menuItem,
          });
        } catch (err) {
         
          return res.status(500).json({
            status: false,
            message: err.message || "Internal server error",
          });
        }
      }, 
      editItemById: async (req, res) => {
        try {  
          
          const { id } = req.params;
          const { name, description, price, category } = req.body;
            
            const updateData = {
            name,
            description,
            price: parseFloat(price),
            category
          };
      
          // Add image only if new file uploaded
          if (req.file) { 
            const menuItem = await Menu.findById(id) ;
            const imagePath = path.join('uploads', menuItem.image.split('/').pop());
            if( fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath)
            } 
            updateData.image = `/uploads/${req.file.filename}`;
          }
          
          const updatedItem = await Menu.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Returns updated document
          );
      
          if (!updatedItem) {
            return res.status(404).json({
              status: false,
              message: "Item not found"
            });
          }
      
          return res.status(200).json({
            status: true,
            message: "Item updated successfully",
            data: updatedItem
          });
      
        } catch (err) {
          return res.status(500).json({
            status: false,
            message: err.message || "Internal error"
          });
        }
      } ,
      deleteItemById: async (req, res) => {
        try {
          const { id } = req.params;
          
          const menuItem = await Menu.findById(id);
          if (!menuItem) {
            return res.status(404).json({ 
              status: false, 
              message: "Menu item not found" 
            });
          } 
            console.log(menuItem)
           
          // Delete associated image if exists
          if (menuItem.image) {
            const imagePath = path.join('uploads', menuItem.image.split('/').pop());
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
      
          await Menu.findByIdAndDelete(id);
          
          return res.status(200).json({
            status: true,
            message: "Menu item deleted successfully"
          });
      
        } catch (err) {
          return res.status(500).json({
            status: false,
            message: err.message || "Internal server error"
          });
        }
      } ,
      getAllCategories : async (req,res)=>{
        try{
          const menuItems = await Menu.find({});
          const categories = menuItems.map(item => item.category) 
          res.status(200).json({status : true , message : "Categories fetched successfully" , data : categories})
        }catch(err){

        }
      }
      
}   

export default menuController;
