const categoryService = require("../services/categoryService")
const {error} = require("../middleware/error")
// const auth = require("../middleware/auth")

const createTopCategory = async(req,res) =>{
  const {topCategoryName} = req.body
  const {id} = req.admin
  try{
    if(!topCategoryName){
      const inputKeyError = error(500,"INPUT_KEY_ERROR")
      throw inputKeyError
    }
    await categoryService.createTopCategory(topCategoryName)
    res.status(200).json({message:"successfully created"})
  }catch(err){
    res.status(err.statusCode).json({message:err.message})
  }
}
const updateTopCategory = async(req,res) =>{
  const id = req.params.id
  const {topCategoryName} = req.body
  try{
    if(!topCategoryName){
      const inputKeyError = error(500,"INPUT_KEY_ERROR ")
      throw inputKeyError
    }
    await categoryService.updateTopCategory(id,topCategoryName)
    res.status(200).json({message: "successfully updated"})

  }catch(err){
    res.status(err.statusCode|| 500).json({message:err.message})
  }
}

const getTopCategories = async (req,res) =>{
  try{
    const topCategory = await categoryService.getTopCategories()
    res.status(200).json({topCategory})

  }catch(err){
    res.status(error.statusCode || 500).json({message:error.message})
  }
}
const deleteTopCategory = async(req,res) =>{
  const id = req.params.id
  try{
    await categoryService.deleteTopCategory(id)
    res.status(204).json({message:""})

  }catch(err){
    res.status(error.statusCode||500)
  }
}

const createSubCategory = async(req,res) =>{
  const {topCategoryId,topCategoryName} = req.body
  try{
    if(!topCategoryId||!topCategoryName){
      const inputKeyError = error(500,"INPUT_KEY_ERROR")
      throw inputKeyError
    }
    await categoryService.createSubCategory(topCategoryId,topCategoryName)
    res.status(200).json({message: "successfully created"})

  }catch(err){
    res.status(err.statusCode).json({message: err.message})
  }
}
const getSubCategories = async(req,res) =>{
  try{
    const subCategory = await categoryService.getSubCategories()
    res.status(200).json({subCategory})
  }catch(err){
    res.status(error.statusCode || 500).json({message:error.message})
  }
}
const updateSubCategory = async(req,res) =>{
  const id = req.params.id
  const {subCategoryName,topCategoryId} = req.body
  try{
    if(!subCategoryName|| !topCategoryId ){
      const inputKeyError = error(500,"INPUT_KEY_ERROR ")
      throw inputKeyError
    }
    await categoryService.updateSubCategory(subCategoryName,topCategoryId,id)
    res.status(200).json({message: "successfully updated"})

  }catch(err){
    res.status(err.statusCode|| 500).json({message:err.message})
  }
}
const deleteSubCategory = async(req,res)=>{
  const id = req.params.id
  try{
     await categoryService.deleteSubCategory(id)
     res.status(204).json({message: ""})
  }catch(err){
    res.status(statusCode||500)
  }
}

module.exports = {
  getTopCategories,
  createTopCategory,
  updateTopCategory,
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteTopCategory,
  deleteSubCategory
}