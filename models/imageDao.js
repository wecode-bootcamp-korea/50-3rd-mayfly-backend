const { appDataSource } = require("./datasource");

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
  getImages,
  getImage,
  deleteImage
}