const userServices = require("../services/userService");


// 카카오 회원가입 및 로그인
const userSignup = async (req, res) => {
    //const code = ''
    const code = req.headers.code;
    try {
        if (!code) {
            return res.status(400).json({ message: "CODE ERROR" });
        }
        const result = await userServices.userSignup(code);
        return res.status(200).json({ jwtToken: result, message: "LOGIN_SUCCESS" });
    } catch (err) {
        return res.status(500).json({ message: "SERVER ERROR" });
    };
};

//유저 정보 조회
const getUserByInfo = async(req, res) => {
    try{
        const userGetInfo = req.users;
        const userGetInfoList = await userServices.getUserByInfo(userGetInfo);
        return res.status(200).json({userGetInfoList: userGetInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

// 유저 정보 수정
const updateUser = async(req, res) => {
    try{
        const userUpdateToken = req.users;
        const userUpdateInfo  = req.body;
        const userUpdateList = await userServices.updateUser(userUpdateToken, userUpdateInfo);
        return res.status(200).json({userUpdateList: userUpdateList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

//유저 정보 삭제
const deleteUserByInfo = async(req, res) => {
    try{
        const userDeleteInfo = req.users;
        const userDeleteInfoList = await userServices.deleteUserByInfo(userDeleteInfo);
        return res.status(200).json({userDeleteInfoList: userDeleteInfoList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};

//유저 크레딧 조회
const getUserByCredit = async(req, res) => {
    try{
        const userCreditInfo = req.users;
        const userCreditList = await userServices.getUserByCredit(userCreditInfo);
        return res.status(200).json({userCreditList: userCreditList})
    }catch(err){
        return res.status(500).json({ message: "SERVER ERROR" });
    }
};




module.exports = {
    userSignup, getUserByInfo, updateUser, deleteUserByInfo, getUserByCredit
}