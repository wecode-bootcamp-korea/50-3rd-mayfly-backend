const adminServices = require("../services/adminService");

const adminSignup = async (req, res) => {
    const { admin_id, password } = req.body;
    try {
        if (!admin_id || !password) {
            return res.json({ message: "Key_error" });
        }
        const result = await adminServices.adminSignup(admin_id, password);
        return res.json({ message: "created_success" });
    } catch (err) {
        return res.json({ message: "created_fail" });
    };
};

const adminLogin = async (req, res) => {
    const { admin_id, password } = req.body;
    try {
        if (!admin_id || !password) {
            return res.json({ message: "key_error" });
        }
        const result = await adminServices.adminLogin(admin_id, password);
        if (result === false) {
            return res.json({ message: "passwords_do_not_match" });
        }
        return res.json({ accessToken: result, message: "login_success" });
    } catch (err) {
        return res.json({ message: "login_fail" })
    };
};

const getUsersList = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;
        const result = await adminServices.getUsersList(adminId);
        return res.status(200).json({ message: result });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({ message: err.message });
    };
};

const deleteUserByUserId = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;
        const userId = req.params.userId;
        const result = await adminServices.deleteUserByUserId(adminId, userId);
        return res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({ message: err.message });
    };
};

const restoreUserByUserId = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;
        const userId = req.params.userId;
        const result = await adminServices.restoreUserByUserId(adminId, userId);
        return res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({ message: err.message });
    };
}

const getHostsList = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;
        const result = await adminServices.getHostsList(adminId);
        return res.status(200).json({ message: result });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({ message: err.message });
    };
};

const deleteHostByHostId = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;
        const hostId = req.params.hostId;
        const result = await adminServices.deleteHostByHostId(adminId, hostId);
        return res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({ message: err.message });
    };
};

const restoreHostByHostId = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;
        const hostId = req.params.hostId;
        const result = await adminServices.restoreHostByHostId(adminId, hostId);
        return res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({ message: err.message });
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
}