const classesService = require("../services/classesService");

const getClassesList = async(req,res) => {
  try{
    let { topCategoryName, subCategoryName, sortBy, search} = req.query;
    console.log(req.query);
    const result = await classesService.getClassesList(
      topCategoryName,subCategoryName, sortBy, search
    );
    return res.status(200).json({ message: result});

  }catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  };
};
const getUpcomingClasses = async(req,res) => {
  try{
    const result = await classesService.getUpcomingClasses();
    return res.status(200).json({ message: result});

  }catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  };

}
const getClasseDetail = async(req,res) => {
  try{
    const classId = req.params.classId;
    const result = await classesService.getClassDetail(classId);
    return res.status(200).json({ message: result});
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  };
};
const getMyClassesList =  async(req,res) => {
  try {
    const userId = req.users.id;
    const result = await classesService.getMyClassesList(userId);
    return res.status(200).json({ message: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  };
};
const getHostClassesList =  async(req,res) => {
  try {
    const hostId = req.hosts.id;
    const result = await classesService.getHostClassesList(hostId);
    return res.status(200).json({ message: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  };
};
const createClass = async(req,res) => {
  try{
    const hostId = req.hosts.id;
    const result = await classesService.createClass(hostId,req);
    return res.status(200).json({ result });
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  };
};
const updateClass = async(req,res) => {
  try{
    const hostId = req.hosts.id;
    const classId = req.params.classId;
    const result = await classesService.updateClass(hostId,classId,req);
    return res.status(200).json({ message: result});
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  };
};
const deleteClass = async(req,res) => {
  try{
    const hostId = req.hosts.id;
    const classId = req.params.classId;
    const result = await classesService.deleteClass(hostId,classId);
    return res.status(200).json({ message: result});
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  };
};

module.exports = {
  getClassesList,
  getUpcomingClasses,
  getClasseDetail,
  getMyClassesList,
  getHostClassesList,
  createClass,
  deleteClass,
  updateClass
};