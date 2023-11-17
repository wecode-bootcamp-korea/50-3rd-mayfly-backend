const imageDao = require('../models/imageDao');
const { error } = require("../middleware/error");

// const saveImage = async (imageUrl) => {
//     const image = await imageDao.createImages(imageUrl);
//     return image
// };
const getImages = async()=>{
  const images = await imageDao.getImages()
  if(images.length === 0){
    error(500,"없습니다.")
  }
  return images
}
const getImage = async(classId) => {
  const image = await imageDao.getImage(classId)
  if(image.length === 0){
    error(404,'없는 클래스입니다.')
    throw error;
  }
  return image
}
const deleteImage = async(id) => {
  const image = await imageDao.deleteImage(id)
  return image
}

module.exports = {
  // saveImage,
  getImages,
  getImage,
  deleteImage
};
