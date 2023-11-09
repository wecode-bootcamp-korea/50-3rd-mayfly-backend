const { appDataSource } = require("./datasource");

const createTopCategory = async(topCategoryName) =>{
  return await appDataSource.query(`
  INSERT INTO top_categories(name) VALUES ('${topCategoryName}')
  `)
}

const getTopCategories = async() =>{
  return await appDataSource.query(`
  SELECT * FROM top_categories 
  `)
}

const getTopCategory = async(id) => {
  return await appDataSource.query(`
  SELECT * FROM top_categories where id = ?
  `,[id])
}

const updateTopCategory = async(id,topCategoryName) =>{
  
  return await appDataSource.query(`
  UPDATE top_categories SET name = ?
  WHERE id = ?
  `,[topCategoryName,id])
}

const createSubCategory = async(topCategoryId,topCategoryName) =>{
  return await appDataSource.query(`
  INSERT INTO sub_categories(top_category_id,name) VALUES (${topCategoryId},'${topCategoryName}')
  `)
}

const getSubCategories = async () =>{
  return await appDataSource.query(`
  SELECT * FROM sub_categories
  `)
}
const getSubCategory = async(id) =>{
  return await appDataSource.query(`
  SELECT * FROM sub_categories where id = ?
  `,[id])
}

const updateSubCategory = async(subCategoryName,topCategoryId,id) =>{
  return await appDataSource.query(`
  UPDATE sub_categories SET name = ?, top_category_id = ?
  WHERE id = ?
  `,[subCategoryName,topCategoryId,id])
}


module.exports = {
  createTopCategory,
  getTopCategory,
  getTopCategories,
  updateTopCategory,
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory
}