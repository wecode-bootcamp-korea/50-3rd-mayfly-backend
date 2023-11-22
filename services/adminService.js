const adminDao = require("../models/adminDao");
const adminVerifyToken = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { error } = require("../middleware/error");


const adminSignup = async (admin_id, password) => {
    try {
        const dbUserData = await adminDao.checkAdmin(admin_id);
        if (dbUserData.length !== 0) {
            return "ID is duplicated"
        };
        const pwValidation = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,20})/;
        if (!pwValidation.test(password)) {
            return "Password must be between 10 and 20 characters and include at least one letter, one number, and one special character (!@#$%^&*)"
        };
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        password = hashedPassword;
        const result = await adminDao.adminSignup(admin_id, password);
        return result;
    } catch (err) {
        throw err;
    }
};

const adminLogin = async (admin_id, password) => {
    try {
        const dbData = await adminDao.checkAdmin(admin_id);
        if (dbData.length === 0) {
            return "ID does not exist or password is incorrect"
        };
        const dbPassword = dbData[0].password;
        const decode = await bcrypt.compare(password, dbPassword);
        if (decode === false) {
            return "ID does not exist or password is incorrect"
        };
        const result = await adminDao.adminLogin(admin_id);
        if (result.length === 0) {
            return "ID does not exist or password is incorrect"
        };
        const dbId = result[0].id;
        const jwtToken = await adminVerifyToken.adminCreateToken(dbId, admin_id);
        return jwtToken;
    } catch (err) {
        console.error("An error occurred during login:", err);
        throw err;
    }
};

const getUsersList = async (adminId) => {
    try {
        const [esistingAdmin] = await adminDao.checkAdmin(adminId);
        if (esistingAdmin.admin_id !== adminId) {
            error(400, 'ADMIN_ID_NOT_MATCH')
        };
        const result = adminDao.getUsersList();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    };
};

const deleteUserByUserId = async (adminId, userId) => {
    try {
        const [esistingAdmin] = await adminDao.checkAdmin(adminId);
        if (esistingAdmin.admin_id !== adminId) {
            error(400, 'ADMIN_ID_NOT_MATCH')
        };
        const checkUserCreditByUserId = await adminDao.checkUserCreditByUserId(userId);
        if (checkUserCreditByUserId.length > 0) {
            error(400, 'USER_CREDIT_ISSUE')
        };
        const checkUserScheduleByUserId = await adminDao.checkUserScheduleByUserId(userId);
        if (checkUserScheduleByUserId.length > 0) {
            error(400, 'USER_SCHEDULE_ISSUE')
        };
        await adminDao.deleteUserByUserId(userId);
        await adminDao.deleteLikesByUserId(userId);
        return ({ message: 'USER_DELETED_SUCCESS' });
    } catch (err) {
        console.error(err);
        throw err;
    };
};

const restoreUserByUserId = async (adminId, userId) => {
    try {
        const [existingAdmin] = await adminDao.checkAdmin(adminId);
        if (existingAdmin.admin_id !== adminId) {
            error(400, 'ADMIN_ID_NOT_MATCH')
        };
        const checkExistenceUser = await adminDao.getUsersList(userId);
        if (!checkExistenceUser) {
            error(400, 'USER_EXISTS')
        };
        await adminDao.restoreUserId(userId);
        return ({ message: 'USER_RESTORE_SUCCESS' })
    } catch (err) {
        console.error(err);
        throw err;
    };
};

const getHostsList = async (adminId) => {
    try {
        const [esistingAdmin] = await adminDao.checkAdmin(adminId);
        if (esistingAdmin.admin_id !== adminId) {
            error(400, 'ADMIN_ID_NOT_MATCH')
        };
        const result = adminDao.getHostsList();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    };
};

const deleteHostByHostId = async (adminId, hostId) => {
    try {
        const [esistingAdmin] = await adminDao.checkAdmin(adminId);
        if (esistingAdmin.admin_id !== adminId) {
            error(400, 'ADMIN_ID_NOT_MATCH')
        };
        const checkHostCreditByUserId = await adminDao.checkHostCreditByHostId(hostId);
        if (checkHostCreditByUserId.length > 0) {
            error(400, 'HOST_CREDIT_ISSUE')
        };
        const checkHostScheduleByUserId = await adminDao.checkHostScheduleByHostId(hostId);
        if (checkHostScheduleByUserId.length > 0) {
            error(400, 'HOST_SCHEDULE_ISSUE')
        };
        await adminDao.deleteHostClassByHostId(hostId);
        await adminDao.deleteHostInfoByHostId(hostId);
        return ({ message: 'HOST_DELETED_SUCCESS' });
    } catch (err) {
        console.error(err);
        throw err;
    };
};

const restoreHostByHostId = async (adminId, hostId) => {
    try {
        const [existingAdmin] = await adminDao.checkAdmin(adminId);
        if (existingAdmin.admin_id !== adminId) {
            error(400, 'ADMIN_ID_NOT_MATCH')
        };
        const checkExistenceHost = await adminDao.getHostsList(hostId);
        if (!checkExistenceHost) {
            error(400, 'HOST_EXISTS')
        };
        await adminDao.restoreHostId(hostId);
        return ({ message: 'HOST_RESTORE_SUCCESS' })
    } catch (err) {
        console.error(err);
        throw err;
    };
}

module.exports = {
    adminSignup,
    adminLogin,
    getUsersList,
    deleteUserByUserId,
    restoreUserByUserId,
    getHostsList,
    deleteHostByHostId,
    restoreHostByHostId
};
