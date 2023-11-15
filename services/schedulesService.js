const schedulesDao = require("../models/schedulesDao");
const classesDao = require("../models/classesDao");
const { error } = require("../middleware/error");

const createSchedule = async(hostId,classId,data) => {
  const [compareByHostId] = await classesDao.getClassDetailByClassId(classId);
    //강의의 강사와 토큰의 강사의 id가 일치하는지 검증
  if(compareByHostId.hostId !== hostId){
    error(400,'HOST_DOES_NOT_MATCH');
  };  
  const {classDay,classHour,maxMember} = data;
  if(!classDay || !classHour || !maxMember) {
    error(400, 'ALL_FIELDS_MUST_BE_FILLED');
  };
  await schedulesDao.createScheduleByHostId(classDay,classId,classHour,maxMember);
  return {message:"CRATE_SCHEDULE_SUCCESS"};
};

const updateSchedule = async(hostId,scheduleId,data) => {
  const [compareByHostID] = await schedulesDao.getScheduleByHostId(scheduleId,hostId);
  if(compareByHostID.length===0){
    error(400,'HOST_DOES_NOT_MATCH');
  };
  const {classDay,classHour,maxMember} = data;
  if(!classDay || !classHour || !maxMember) {
    error(400, 'ALL_FIELDS_MUST_BE_FILLED');
  };
  await schedulesDao.updateScheduleByScheduleId(classDay,classHour,maxMember,scheduleId);
  return {message:"UPDATE_SCHEDULE_SUCCESS"};
};

const deleteSchedule = async(hostId,scheduleId) => {
  const compareByHostID = await schedulesDao.getScheduleByHostId(scheduleId,hostId);
  if(compareByHostID.length===0){
    error(400,'HOST_DOES_NOT_MATCH');
  };
  await schedulesDao.deleteScheduleByStatus(scheduleId);
  return {message:"DELETE_SCHEDULE_SUCCESS"};
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule
};