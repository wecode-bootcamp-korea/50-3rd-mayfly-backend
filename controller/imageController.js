const imageService = require('../services/imageService');
const {error} = require("../middleware/error")
const uploadImage = async (req, res) => {
  try {
    const images = req.file
    const imageKey = images.key
    const imageUrl = `https://mayfly-bucket.s3.ap-northeast-2.amazonaws.com/${imageKey}`;
    res.json({ imageUrl });
  } catch (err) {
    console.error('Error during image upload:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getImages = async(req,res) =>{
  try{
    const images = await imageService.getImages()
    res.status(200).json({images})
  }catch(err){
    res.status(error.statusCode || 500).json({message:error.message })
  }
}
const getImage = async(req,res) => {
  const classId = req.params.classId
  try{
    const image = await imageService.getImage(classId)
    res.status(200).json({image})
  }catch(err){
    res.status(err.statusCode||404).json({message:err.message })
  }
}

const deleteImage = async(req,res) => {
  const id = req.params.id
  try{
    const image = await imageService.deleteImage(id)
    res.status(204).json({})
  }catch(err){
    res.status(err.statusCode || 500).json({message: err.message})
  }
}

module.exports = {
  uploadImage,
  getImages,
  getImage,
  deleteImage
};
