const { appDataSource } = require("./datasource");

const createScheduleByHostId = async(classDay,classId,classHour,maxMember) => {
  const query = `
    INSERT INTO schedules (class_day, class_id, class_hour, max_member, enrolled_member, status)
    VALUES (?, ?, ?, ?, 0, 1);
  `;
  const result = await appDataSource.query(query, [classDay, classId, classHour, maxMember]);
  return result;
};
const getScheduleByHostId = async(scheduleId,hostId) => {
  const query = `
  SELECT s.id AS schedule_id,c.host_id
  FROM schedules s
  JOIN classes c ON s.class_id = c.id
  WHERE s.id = ?
  AND c.host_id = ?;`
  return await appDataSource.query(query,[scheduleId,hostId]);
};
const updateScheduleByScheduleId = async(classDay,classHour,maxMember,scheduleId) => {
  const query = `
  UPDATE schedules
  SET
      class_day = ?,
      class_hour = ?,
      max_member = ?,
  WHERE id = ?
  `
  return await appDataSource.query(query,[classDay,classHour,maxMember,scheduleId])
};
const deleteScheduleByStatus = async(scheduleId) => {
  const query = `UPDATE schedules SET status = 0 WHERE id = ?`
  return await appDataSource.query(query,[scheduleId]);
};


module.exports = {
  createScheduleByHostId,
  getScheduleByHostId,
  updateScheduleByScheduleId,
  deleteScheduleByStatus
};