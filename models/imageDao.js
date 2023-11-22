const { appDataSource } = require("./datasource");

const createImages = async(imageName,classId,imageUrl) =>{
  return appDataSource.query(`
  INSERT INTO images (name,class_id,image_source) VALUES ('${imageName}','${classId}','${imageUrl}')
  `)
}
const getImages = async() => {
  return appDataSource.query(`
  SELECT * FROM images  
  `)
}
const getImage = async(classId) =>{
  return appDataSource.query(`
  SELECT * FROM images WHERE class_id = ${classId}
  `)
}
const deleteImage = async(id) =>{
  return appDataSource.query(`
  DELETE FROM images WHERE id = ${id}
  `)
}

module.exports = {
  createImages,
  getImages,
  getImage,
  deleteImage
}