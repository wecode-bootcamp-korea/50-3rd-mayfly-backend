const database = require("./datasource")


const checkAdmin = async (adminId) => {
    return await database.appDataSource.query(`
        SELECT * FROM 
            admins 
        WHERE 
            admin_id = ?`, [adminId])
};

const adminSignup = async (admin_id, password) => {
    return await database.appDataSource.query(`
        INSERT INTO 
            admins (admin_id, password) 
        VALUES (? ,?)`, [admin_id, password])
};

const adminLogin = async (admin_id) => {
    return await database.appDataSource.query(`
        SELECT * FROM 
            admins 
        WHERE 
            admin_id = ?;`, [admin_id])
};

const getUsersList = async () => {
    return await database.appDataSource.query(`SELECT * FROM users`)
};

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

const deleteUserByUserId = async (userId) => {
    return await database.appDataSource.query(`UPDATE users SET deleted_at = NOW() WHERE id = ?`, [userId])
};

const deleteLikesByUserId = async (userId) => {
    return await database.appDataSource.query(`DELETE FROM likes WHERE user_id =?`, [userId])
};

const restoreUserId = async (userId) => {
    return await database.appDataSource.query(`UPDATE users SET deleted_at = null WHERE id = ?`, [userId])
}

const getHostsList = async () => {
    return await database.appDataSource.query(`SELECT * FROM hosts`)
};

const checkHostCreditByHostId = async (hostId) => {
    return await database.appDataSource.query(`SELECT credit FROM hosts WHERE id = ? AND credit > 0`, [hostId])
};

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

const deleteHostClassByHostId = async (hostId) => {
    return await database.appDataSource.query(`
        UPDATE 
            classes 
        SET 
            deleted_at = NOW() 
        WHERE 
            host_id = ?`, [hostId])
};

const deleteHostInfoByHostId = async (hostId) => {
    return await database.appDataSource.query(`
        UPDATE 
            hosts 
        SET 
            deleted_at = NOW() 
        WHERE 
            id = ?`, [hostId])
};

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

