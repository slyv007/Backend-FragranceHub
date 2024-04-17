import slugify from "slugify";
import Category from "../models/category.js";


export const  createCategory = async (req, res ) =>{
    try {
        const { name} = req.body
        if(!name) {
            return res.status(400).json( "Name is required");
        }

        const existingCategory = await Category.findOne ({ name})

        if (existingCategory) {
            return res.status(400).json({successs: false, message: "Category already exists"});
        }

        const category = await new Category({name, slug:slugify(name)}).save()

        res.json({successs: true, message: "Category created successfully", category});
        
    } catch (err) {
        console.log(err);
        res.json({successs: false, message: "Internal Server Error", errMsg: err.message});
        
    }
}

export const createCategoryById = async(req, res)=>{
    try {
      const { productId } = req.params

      const product = await product.findById({_id: productId})
      if (!product) {
        return res.status(404).json({success: false, message:"product not found "})
      }
      res.json({success: true, message: "product Retrieved successfully", product})

    } catch (err) {
      console.log("Error creating product", err.message);
      res.status(500).json({success: false, error: "Internal server error", message: err.message})
      
    }
}


export const createCategoryBySlug = async(req, res)=>{
    try {
      const { slug } = req.params

      const product = await product.findOne({ slug: slug })
    } catch (err) {
      console.log("Error creating product", err.message);
      res.status(500).json({success: false, error: "Internal server error", message: err.message})
      
    }
}



export const updateCategory = async(req, res)=>{
    try {
      const { title, desc, price, isAvailable,  } = req.body
      const { productId } = req.params

    //   find the productbyId from the database

    const product = await product.findById({_id: productId})
    if (!product) {
      return res.status(404).json({success: false, message:"product not found "})
    }

    if (title) {
        const slugTitle = slugify(title)
        product.slug = slug(title) || product.slug
    }

    
    // update the fields
    product.title = title || product.title
    product.desc = desc || product.desc
    product.price = price || product.price
    product.isAvailable = isAvailable || product.isAvailable
    

    // save the updatedProduct
    const updatedProduct = await product.save()

    res.json({success: true, message: "product updated successfully", updatedProduct})
    

    } catch (err) {
      console.log("Error creating product", err.message);
      res.status(500).json({success: false, error: "Internal server error", message: err.message})
      
    }
}


export const deleteCategory = async(req, res)=>{
    try {
      
    } catch (err) {
      console.log("Error creating product", err.message);
      res.status(500).json({success: false, error: "Internal server error", message: err.message})
      
    }
  }