const schedulesDao = require("../models/schedulesDao");
const classesDao = require("../models/classesDao");
const { error } = require("../middleware/error");

const getSchedulesByclassId = async(hostId, classId) => {
  const [compareByHostId] = await classesDao.getClassDetailByClassId(classId);
  if (compareByHostId.hostId !== hostId) {
    return error(400,'HOST_DOES_NOT_MATCH');
  };

  return await schedulesDao.getSchedulesByclassId(classId);
};

const createSchedules = async (hostId, classId, scheduleData) => {
  const [compareByHostId] = await classesDao.getClassDetailByClassId(classId);
  if (compareByHostId.hostId !== hostId) {
    error(400, 'HOST_DOES_NOT_MATCH');
  };

  const errors = [];
  let successfulCount = 0;

  for (let i = 0; i < scheduleData.schedule_info.length; i++) {
    const { classDay, classHour, maxMember } = scheduleData.schedule_info[i];

    if (!classDay || !classHour || !maxMember) {
      errors.push({ index: i, error: 'ALL_FIELDS_MUST_BE_FILLED' });
      continue;
    };

    const existingSchedule = await schedulesDao.findScheduleByDateTime(classId, classDay,'');
    if (existingSchedule && existingSchedule.length > 0) {
      errors.push({ index: i, error: 'SCHEDULE_ALREADY_EXISTS' });
      continue;
    };

    try {
      await schedulesDao.createScheduleByHostId(classDay, classId, classHour, maxMember);
      successfulCount++;
    } catch (error) {
      errors.push({ index: i, error: error.message });
    };
  };

  return {
    message: successfulCount > 0 ? `${successfulCount} CREATE_SCHEDULES_SUCCESS` : "ALL_SCHEDULES_CREATE_FAILED",
    errors
  };
};

const updateSchedule = async (hostId, scheduleId, scheduleData) => {
  try {
    const [compareByHostID] = await schedulesDao.getScheduleByHostId(scheduleId, hostId);
    if (compareByHostID.length === 0) {
      error(400, 'HOST_DOES_NOT_MATCH');
    };

    const checkSchedulesEnrolledMember = await schedulesDao.schedulesEnrolledMemberCheckByscheduleId(scheduleId);
    if (checkSchedulesEnrolledMember.length > 0) {
      error(400, 'CANNOT_UPDATE_CLASS_AS_SCHEDULES_ENROLLED_MEMBER');
    };

    const { classDay, classHour, maxMember } = scheduleData;
    if (!classDay || !classHour || !maxMember) {
      error(400, 'ALL_FIELDS_MUST_BE_FILLED');
    };
    
    const classId = compareByHostID.class_id;
    const currentScheduleId = `AND id != ${scheduleId}`
    const existingSchedule = await schedulesDao.findScheduleByDateTime(classId, classDay, currentScheduleId);
    if (existingSchedule && existingSchedule.length > 0) {
      error(400, 'SCHEDULE_ALREADY_EXISTS');
    };

    await schedulesDao.updateScheduleByScheduleId(classDay, classHour, maxMember, scheduleId);
    return { message: "UPDATE_SCHEDULE_SUCCESS" };
  } catch (err) {
    return { error: err.message, statusCode: err.statusCode || 500 };
  }
};

const deleteSchedule = async (hostId, scheduleId) => {
  try {
    const compareByHostID = await schedulesDao.getScheduleByHostId(scheduleId, hostId);
    if (compareByHostID.length === 0) {
      error(400, 'HOST_DOES_NOT_MATCH');
    };

    const checkSchedulesEnrolledMember = await schedulesDao.schedulesEnrolledMemberCheckByscheduleId(scheduleId);
    if (checkSchedulesEnrolledMember.length > 0) {
      error(400, 'CANNOT_DELETE_CLASS_AS_SCHEDULES_ENROLLED_MEMBER');
    };

    await schedulesDao.deleteScheduleByStatus(scheduleId);
    return { message: "DELETE_SCHEDULE_SUCCESS" };
  } catch (err) {
    return { error: err.message, statusCode: err.statusCode || 500 };
  }
};

module.exports = {
  getSchedulesByclassId,
  createSchedules,
  updateSchedule,
  deleteSchedule
};