const schedulesService = require("../services/schedulesService");

const createSchedule = async(req,res) => {
  try{
    // const hostId = req.hosts.id;
    const hostId = 6;
    const classId = req.params.classid;
    const result = await schedulesService.createSchedule(hostId,classId,req.body);
    return res.status(200).json({ result });
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const updateSchedule = async(req,res) => {
  try{
    const hostId = req.hosts.id;
    const scheduleId = req.params.scheduleid; 
    const result = await schedulesService.updateSchedule(hostId,scheduleId,req.body);
    return res.status(200).json({ result });
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  };
};
const deleteSchedule = async(req,res) => {
  try{
    const hostId = req.hosts.id;
    const scheduleId = req.params.scheduleid; 
    const result = await schedulesService.updateSchedule(hostId,scheduleId);
    return res.status(200).json({ result });
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  };
};


module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule
};