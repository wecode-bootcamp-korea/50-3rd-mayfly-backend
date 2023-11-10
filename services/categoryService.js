const categoryDao = require("../models/categoryDao");
const { error } = require("../middleware/error");

const createTopCategory = async (topCategoryName) => {
  const topCategory = await categoryDao.createTopCategory(topCategoryName);
  return topCategory;
};
const getTopCategories = async () => {
  const topCategory = await categoryDao.getTopCategories();
  if (topCategory.length === 0) {
    error(500, "없습니다");
  }
  return topCategory;
};
const updateTopCategory = async (id, topCategoryName) => {
  const getTopCategory = await categoryDao.getTopCategory(id)
  const topCategory = await categoryDao.updateTopCategory(id, topCategoryName);
  if(getTopCategory.length ===0 ){
    throw error(500, "해당 카테고리가 존재하지 않습니다.");
  }
  return topCategory;
};
const deleteTopCategory = async(id) => {
  const topCategory = await categoryDao.deleteTopCategory(id)
  return topCategory
} 
const getSubCategories = async () => {
  const subCategory = await categoryDao.getSubCategories();
  if (subCategory.length === 0) {
    throw error(500, "없습니다");
  }
  return subCategory;
};

const createSubCategory = async(topCategoryId,topCategoryName)=>{
  const subCategory = await categoryDao.createSubCategory(topCategoryId,topCategoryName)
  return subCategory
}

const updateSubCategory = async (subCategoryName,topCategoryId,id) => {
  const getSubCategory = await categoryDao.getSubCategory(id)
  const subCategory = await categoryDao.updateSubCategory(subCategoryName,topCategoryId,id);
  if(getSubCategory.length ===0 ){
    throw error(500, "해당 카테고리가 존재하지 않습니다.");
  }
  return subCategory;
};
const deleteSubCategory = async(id) =>{
  const subCategory = await categoryDao.deleteSubCategory(id)
  return subCategory
}

module.exports = {
  getTopCategories,
  createTopCategory,
  updateTopCategory,
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteTopCategory,
  deleteSubCategory
};
