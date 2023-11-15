const hostServices = require("../services/hostService");


// 카카오 회원가입 및 로그인
const hostSignup = async (req, res) => {
    //const code = ''
    const code = req.headers.code;
    console.log(code)
    try {
        if (!code) {
            return res.status(400).json({ message: "CODE ERROR" });
        }
        const result = await hostServices.hostSignup(code);
        return res.status(200).json({ jwtToken: result, message: "LOGIN_SUCCESS" });
    } catch (err) {
        return res.status(500).json({ message: "SERVER ERROR" });
    };
};

//호스트 정보 조회
const getHost = async(req, res) => {
    try{
        const hostInfo = req.hosts;
        const hostInfoList = await hostServices.getHost(hostInfo);
        return res.status(200).json({hostInfoList: hostInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

// 호스트 정보 수정
const updateHost = async(req, res) => {
    try{
        const hostUpdateToken = req.hosts;
        const hostUpdateInfo = req.body;
        const hostUpdateList = await hostServices.updateHost(hostUpdateToken, hostUpdateInfo);
        return res.status(200).json({hostUpdateList: hostUpdateList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

//호스트 정보 삭제
const deleteHost = async(req, res) => {
    try{
        const hostDeleteInfo = req.hosts;
        const hostDeleteInfoList = await hostServices.deleteHost(hostDeleteInfo);
        return res.status(200).json({hostDeleteInfoList: hostDeleteInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

//호스트 크레딧 조회
const getHostCredit = async(req, res) => {
    try{
        const hostCreditInfo = req.hosts;
        const hostCreditList = await hostServices.getHostCredit(hostCreditInfo);
        return res.status(200).json({hostCreditList: hostCreditList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};


module.exports = {
    hostSignup, getHost, updateHost, deleteHost, getHostCredit
}