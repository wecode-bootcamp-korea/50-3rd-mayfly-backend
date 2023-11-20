const { appDataSource } = require("./datasource");

const getSchedulesByclassId = async(classId) => {
  const query =`
  SELECT 
    id,
    DATE_FORMAT(class_day, '%Y-%m-%d %H:%i') AS classDay, 
    class_hour AS classHour, 
    max_member AS maxMember, 
    enrolled_member AS enrolledMember,
    status
  FROM schedules
  WHERE class_id = ?
  GROUP BY id
  ORDER BY class_day
  `;
  const result = await appDataSource.query(query,[classId]);
  return result;
};

const findScheduleByDateTime = async (classId, classDay, currentScheduleId) => {
  const query = `
    SELECT class_day
    FROM schedules 
    WHERE class_id = ? AND class_day = ? 
    ${currentScheduleId}
  `;
  const result = await appDataSource.query(query, [classId, classDay]);
  return result;
};

const createScheduleByHostId = async(classDay,classId,classHour,maxMember) => {
  const query = `
    INSERT INTO schedules 
      (class_day, class_id, class_hour, max_member, enrolled_member, status)
    VALUES 
      (?, ?, ?, ?, 0, 1)
  `;
  const result = await appDataSource.query(query, [classDay, classId, classHour, maxMember]);
  return result;
};
const getScheduleByHostId = async(scheduleId,hostId) => {
  const query = `
  SELECT s.id AS schedule_id,c.host_id,class_id
  FROM schedules s
  JOIN classes c ON s.class_id = c.id
  WHERE s.id = ?
  AND c.host_id = ?`
  return await appDataSource.query(query,[scheduleId,hostId]);
};
const updateScheduleByScheduleId = async(classDay,classHour,maxMember,scheduleId) => {
  const query = `
  UPDATE schedules
  SET 
    class_day = ?, class_hour = ?, max_member = ? 
  WHERE id = ?`;
  return await appDataSource.query(query,[classDay,classHour,maxMember,scheduleId]);
};
const deleteScheduleByStatus = async(scheduleId) => {
  const query = `DELETE FROM schedules WHERE id = ?;`;
  return await appDataSource.query(query,[scheduleId]);
};

const schedulesEnrolledMemberCheckByscheduleId = async(scheduleId) => {
  const query = `
  SELECT * 
  FROM schedules 
  WHERE 
    id = ? 
  AND 
    (status = 1 AND enrolled_member != 0)`;
  return await appDataSource.query(query,[scheduleId]);
};

module.exports = {
  getSchedulesByclassId,
  findScheduleByDateTime,
  createScheduleByHostId,
  getScheduleByHostId,
  updateScheduleByScheduleId,
  deleteScheduleByStatus,
  schedulesEnrolledMemberCheckByscheduleId
};