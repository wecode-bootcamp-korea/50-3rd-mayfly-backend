const database = require("./datasource")

// 관리자 존재 여부 확인
const checkAdmin = async (adminId) => {
    return await database.appDataSource.query(`
        SELECT * FROM 
            admins 
        WHERE 
            admin_id = ?`, [adminId])
};
// 회원가입
const adminSignup = async (admin_id, password) => {
    return await database.appDataSource.query(`
        INSERT INTO 
            admins (admin_id, password) 
        VALUES (? ,?)`, [admin_id, password])
};
// 로그인
const adminLogin = async (admin_id) => {
    return await database.appDataSource.query(`
        SELECT * FROM 
            admins 
        WHERE 
            admin_id = ?;`, [admin_id])
};
//모든 유저 리스트 전달 관리자니까 다 주는게 맞을듯
const getUsersList = async () => {
    return await database.appDataSource.query(`SELECT * FROM users`)
};
//해당 유저 크레딧 있는지 조회
const checkUserCreditByUserId = async (userId) => {
    return await database.appDataSource.query(`
        SELECT 
            credit 
        FROM 
            users 
        WHERE 
            id = ? 
        AND 
            credit > 0`, [userId])
};
//해당 유저 스케줄 있는지 조회
const checkUserScheduleByUserId = async (userId) => {
    const query = `
        SELECT
            users.id,
            users.name,
            schedules.class_day,
            schedules.class_hour,
            schedules.status,
            schedules.id AS schedule_id
        FROM users
        JOIN orders ON users.id = orders.user_id
        JOIN classes ON orders.class_id = classes.id
        INNER JOIN schedules ON classes.id = schedules.class_id
        WHERE users.id = ?
        ND schedules.status = 1
        GROUP BY schedules.id `;
    return await database.appDataSource.query(query, [userId]);
};
//해당 유저 강퇴 (soft)
const deleteUserByUserId = async (userId) => {
    return await database.appDataSource.query(`UPDATE users SET deleted_at = NOW() WHERE id = ?`, [userId])
};
//해당 유저 좋아요 삭제 (hard)
const deleteLikesByUserId = async (userId) => {
    return await database.appDataSource.query(`DELETE FROM likes WHERE user_id =?`,[userId])
};
//해당 유저 복원
const restoreUserId = async (userId) => {
    return await database.appDataSource.query(`UPDATE users SET deleted_at = null WHERE id = ?`, [userId])
}
//모든 등대 리스트 전달
const getHostsList = async () => {
    return await database.appDataSource.query(`SELECT * FROM hosts`)
};
//해당 등대 유저 크레딧 있는지 조회
const checkHostCreditByHostId = async (hostId) => {
    return await database.appDataSource.query(`SELECT credit FROM hosts WHERE id = ? AND credit > 0`, [hostId])
};
//해당 등대유저 스케줄 있는지 조회
const checkHostScheduleByHostId = async (hostId) => {
    const query = `
    SELECT
        classes.id,
        classes.title,
        schedules.class_day,
        schedules.status
    FROM classes
    JOIN schedules ON classes.id = schedules.class_id
    WHERE classes.host_id = ?
    AND schedules.status = 1`;
    return await database.appDataSource.query(query, [hostId]);
};
//해당 등대유저 강의 삭제(soft)
const deleteHostClassByHostId = async (hostId) => {
    return await database.appDataSource.query(`
        UPDATE 
            classes 
        SET 
            deleted_at = NOW() 
        WHERE 
            host_id = ?`, [hostId])
};
//해당 등대유저 강퇴(soft)
const deleteHostInfoByHostId = async (hostId) => {
    return await database.appDataSource.query(`
        UPDATE 
            hosts 
        SET 
            deleted_at = NOW() 
        WHERE 
            id = ?`, [hostId])
};
//해당 등대유저 복원
const restoreHostId = async (hostId) => {
    return await database.appDataSource.query(`
        UPDATE 
            hosts 
        SET 
            deleted_at = null 
        WHERE 
            id = ?`, [hostId])
}

module.exports = {
    checkAdmin,
    adminSignup,
    adminLogin,
    getUsersList,
    deleteUserByUserId,
    checkUserCreditByUserId,
    checkUserScheduleByUserId,
    deleteLikesByUserId,
    getHostsList,
    restoreUserId,
    checkHostCreditByHostId,
    checkHostScheduleByHostId,
    deleteHostClassByHostId,
    deleteHostInfoByHostId,
    restoreHostId
};

