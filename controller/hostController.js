const hostServices = require("../services/hostService");


const hostSignup = async (req, res) => {
    const code = req.headers.code;
    try {
        if (!code) {
            return res.status(400).json({ message: "CODE ERROR" });
        }
        const result = await hostServices.hostSignup(code);
        return res.status(200).json({ jwtToken: result, role: 'hosts', message: "LOGIN_SUCCESS" });
    } catch (err) {
        return res.status(500).json({ message: "SERVER ERROR" });
    };
};

const getHost = async (req, res) => {
    try {
        const hostId = req.hosts.id;
        const hostEmail = req.hosts.email;
        const hostInfoList = await hostServices.getHost(hostId, hostEmail);
        return res.status(200).json({ hostInfoList: hostInfoList })
    } catch (err) {
        return res.status(500).json({ message: "SERVER ERROR" });
    };
};

const updateHost = async (req, res) => {
    try {
        const hostId = req.hosts.id;
        const hostEmail = req.hosts.email;
        const hostUpdateInfo = req.body;
        const hostUpdateList = await hostServices.updateHost(hostId, hostEmail, hostUpdateInfo);
        return res.status(200).json({ hostUpdateList: hostUpdateList })
    } catch (err) {
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

const deleteHost = async (req, res) => {
    try {
        const hostId = req.hosts.id;
        const hostEmail = req.hosts.email;
        const hostDeleteInfoList = await hostServices.deleteHost(hostId, hostEmail);
        return res.status(200).json({ hostDeleteInfoList: hostDeleteInfoList })
    } catch (err) {
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

const getHostCredit = async (req, res) => {
    try {
        const hostId = req.hosts.id;
        const hostEmail = req.hosts.email;
        const hostCreditList = await hostServices.getHostCredit(hostId, hostEmail);
        return res.status(200).json({ hostCreditList: hostCreditList })
    } catch (err) {
        return res.status(500).json({ message: "SERVER ERROR" });
    };
};

module.exports = {
    hostSignup,
    getHost,
    updateHost,
    deleteHost,
    getHostCredit
};