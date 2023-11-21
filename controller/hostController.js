const hostServices = require("../services/hostService");


// 카카오 회원가입 및 로그인
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
//호스트 정보 조회
const getHost = async(req, res) => {
    try{
        const hostId = req.hosts.id;
        const hostInfoList = await hostServices.getHost(hostId);
        return res.status(200).json({hostInfoList: hostInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};
// 호스트 정보 수정
const updateHost = async(req, res) => {
    try{
        const hostId = req.hosts.id;
        const hostUpdateInfo = req.body;
        const hostUpdateList = await hostServices.updateHost(hostId, hostUpdateInfo);
        return res.status(200).json({hostUpdateList: hostUpdateList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};
//호스트 정보 삭제
const deleteHost = async(req, res) => {
    try{
        const hostId = req.hosts.id;
        const hostDeleteInfoList = await hostServices.deleteHost(hostId);
        return res.status(200).json({hostDeleteInfoList: hostDeleteInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};
//호스트 크레딧 조회
const getHostCredit = async(req, res) => {
    try{
        const hostId = req.hosts.id;
        const hostCreditList = await hostServices.getHostCredit(hostId);
        return res.status(200).json({hostCreditList: hostCreditList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

module.exports = {
    hostSignup, 
    getHost, 
    updateHost, 
    deleteHost, 
    getHostCredit
};