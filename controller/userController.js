const userServices = require("../services/userService");


// 카카오 회원가입 및 로그인
const userSignup = async (req, res) => {
    const code = req.headers.code;
    try {
        if (!code) {
            return res.status(400).json({ message: "CODE ERROR" });
        }
        const result = await userServices.userSignup(code);
        return res.status(200).json({ jwtToken: result, role: 'users', message: "LOGIN_SUCCESS" });
    } catch (err) {
        return res.status(500).json({ message: "SERVER ERROR" });
    };
};
//유저 정보 조회
const getUserByInfo = async(req, res) => {
    try{
        const userId = req.users.id;
        const userEmail = req.users.email;
        const userGetInfoList = await userServices.getUserByInfo(userId, userEmail);
        return res.status(200).json({userGetInfoList: userGetInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};
// 유저 정보 수정
const updateUser = async(req, res) => {
    try{
        const userId = req.users.id;
        const userEmail = req.users.email;
        const userUpdateInfo  = req.body;
        const userUpdateList = await userServices.updateUser(userId, userEmail, userUpdateInfo);
        return res.status(200).json({userUpdateList: userUpdateList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};
//유저 정보 삭제
const deleteUserByInfo = async(req, res) => {
    try{
        const userId = req.users.id;
        const userEmail = req.users.email;
        const userDeleteInfoList = await userServices.deleteUserByInfo(userId, userEmail);
        return res.status(200).json({userDeleteInfoList: userDeleteInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};
//유저 크레딧 조회
const getUserByCredit = async(req, res) => {
    try{
        const userId = req.users.id;
        const userCreditList = await userServices.getUserByCredit(userId);
        return res.status(200).json({userCreditList: userCreditList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

module.exports = {
    userSignup, getUserByInfo, updateUser, deleteUserByInfo, getUserByCredit
}