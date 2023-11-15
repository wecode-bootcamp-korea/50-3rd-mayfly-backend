const adminServices = require("../services/adminService");
const bcrypt = require("bcrypt");


// 회원가입
const adminSignup = async (req, res) => {

    const { admin_id, password } = req.body
    try {
        // 요청 정보 확인
        if (!admin_id || !password) {


            return res.json({ message: "Key_error" })
        }

        const result = await adminServices.adminSignup(admin_id, password);

        return res.json({ message: "created_success" });

    } catch (err) {
        return res.json({ message: "created_fail" });
    }
}

//로그인
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
    }
};

//유저 정보 조회
const adminGetUser = async(req, res) => {
    try{
        const adminUserGetInfo = req.admin;
        const adminUserGetInfoList = await adminServices.adminGetUser(adminUserGetInfo);
        return res.status(200).json({adminUserGetInfoList: adminUserGetInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

//유저 정보 삭제
const adminDeleteUser = async(req, res) => {
    try{
        const adminUserDeleteInfo = req.admin;
        const adminUserDeleteInfoList = await adminServices.adminDeleteUser(adminUserDeleteInfo);
        return res.status(200).json({adminUserDeleteInfoList: adminUserDeleteInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

//호스트 정보 조회
const adminGetHost = async(req, res) => {
    try{
        const adminHostInfo = req.admin;
        const adminHostInfoList = await adminServices.adminGetHost(adminHostInfo);
        return res.status(200).json({adminHostInfoList: adminHostInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

//호스트 정보 삭제
const adminDeleteHost = async(req, res) => {
    try{
        const adminHostDeleteInfo = req.admin;
        const adminHostDeleteInfoList = await adminServices.adminDeleteHost(adminHostDeleteInfo);
        return res.status(200).json({adminHostDeleteInfoList: adminHostDeleteInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

module.exports = {
    adminSignup, adminLogin, adminGetUser, adminDeleteUser, adminGetHost, adminDeleteHost
}