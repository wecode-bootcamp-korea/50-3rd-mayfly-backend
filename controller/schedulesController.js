const schedulesService = require("../services/schedulesService");

const getSchedulesByclassId = async(req,res) => {
  try{
    const hostId = req.hosts.id;
    const classId = req.params.classid;
    const result = await schedulesService.getSchedulesByclassId(hostId, classId);
    return res.status(200).json({ result });
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const createSchedule = async(req,res) => {
  try{
    const hostId = req.hosts.id;
    const classId = req.params.classid;
    const scheduleData = req.body;
    const result = await schedulesService.createSchedules(hostId, classId, scheduleData);
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
    const scheduleData = req.body;
    const result = await schedulesService.updateSchedule(hostId, scheduleId, scheduleData);
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
    const result = await schedulesService.deleteSchedule(hostId, scheduleId);
    return res.status(200).json({ result });
  }catch(err){
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  };
};

module.exports = {
  getSchedulesByclassId,
  createSchedule,
  updateSchedule,
  deleteSchedule
};