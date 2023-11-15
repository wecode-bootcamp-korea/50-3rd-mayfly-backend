const adminDao = require("../models/adminDao");
// const { json } = require("body-parser");
const adminVerifyToken = require("../middleware/auth");
const bcrypt = require("bcrypt");

// 회원가입
const adminSignup = async (admin_id, password) => {
    try {
        // 관리자 가입 정보 불러오기
        const dbUserData = await adminDao.checkAdmin(admin_id);

        // admin_id가 존재하는지 확인
        if (dbUserData.length !== 0) {
            return "ID is duplicated"
        }

        // password 정규식
        const pwValidation = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,20})/;

        if (!pwValidation.test(password)) {
            return "Password must be between 10 and 20 characters and include at least one letter, one number, and one special character (!@#$%^&*)"
        }

        // password 암호화
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // 암호화된 데이터를 password에 넣기
        password = hashedPassword;

        // 데이터 저장
        const result = await adminDao.adminSignup(admin_id, password);
        return result;
    } catch (err) {
        throw err;
    }
};

// 로그인
const adminLogin = async (admin_id, password) => {
    try {
        // 아이디 확인
        const dbData = await adminDao.checkAdmin(admin_id);

        if (dbData.length === 0) {
            return "ID does not exist or password is incorrect"
        }
        // 패스워드 복호화
        const dbPassword = dbData[0].password;
        const decode = await bcrypt.compare(password, dbPassword);
        
        if(decode === false){
            return "ID does not exist or password is incorrect"
        }
        
        // 로그인
        const result = await adminDao.adminLogin(admin_id);
        
        if (result.length === 0) {
            return "ID does not exist or password is incorrect"
        }
        
        // 토큰 생성
        const dbId = result[0].id;
        
        const jwtToken = await adminVerifyToken.adminCreateToken(dbId, admin_id);
        console.log(jwtToken)
        return jwtToken;
    } catch (err) {
        console.error("An error occurred during login:", err);
        throw err;
    }
};

//유저 정보 조회
const adminGetUser = async (adminUserGetInfo) => {
    try {
        const adminGetId = adminUserGetInfo.id;
        const adminGetAdmin_id = adminUserGetInfo.admin_id;

        // 1. 관리자 확인
        const adminCheck = await adminDao.realAdmin(adminGetId, adminGetAdmin_id);

        // 관리자가 아닌 경우 처리
        if (!adminCheck || adminCheck.length === 0) {
            return "No information found"; 
        }

        // 2. 유저 정보 조회
        const adminUserGetInfoList = await adminDao.adminGetRealUser(adminGetId, adminGetAdmin_id);
        return adminUserGetInfoList;
    } catch (err) {
        console.error("Error in adminGetUser:", err);
        throw err;
    }
};


//유저 정보 삭제
const adminDeleteUser = async (adminUserDeleteInfo) => {
    try {
        const adminDeleteId = adminUserDeleteInfo.id;
        const adminDeleteAdmin_id = adminUserDeleteInfo.admin_id;

        // 관리자 확인
        const adminCheck = await adminDao.realAdmin(adminDeleteId, adminDeleteAdmin_id);

        // 관리자가 아닌 경우 처리
        if (!adminCheck || adminCheck.length === 0) {
            return "No information found"; 
        }
        // 유저 정보 삭제
        const adminUserDeleteInfoList = await userDao.deleteRealUser(adminDeleteId);

        return adminUserDeleteInfoList;
    } catch (err) {
        console.error("Error in adminDeleteUser:", err);
        throw err;
    }
};


//호스트 정보 조회
const adminGetHost = async (adminHostInfo) => {
    try {
        const adminGetId = adminHostInfo.id;
        const adminGetAdmin_id = adminHostInfo.admin_id;

        // 1. 관리자 확인
        const adminCheck = await adminDao.realAdmin(adminGetId, adminGetAdmin_id);

        // 관리자가 아닌 경우 처리
        if (!adminCheck || adminCheck.length === 0) {
            return "No information found"; 
        }

        // 2. 호스트 정보 조회
        const adminHostInfoList = await adminDao.adminGetRealHost(adminGetId, adminGetAdmin_id);
        return adminHostInfoList;
    } catch (err) {
        console.error("Error in adminGetHost:", err);
        throw err;
    }
};


//호스트 정보 삭제
const adminDeleteHost = async (adminHostDeleteInfo) => {
    try {
        const adminDeleteId = adminHostDeleteInfo.id;
        const adminDeleteAdmin_id = adminHostDeleteInfo.admin_id;

        // 관리자 확인
        const adminCheck = await adminDao.realAdmin(adminDeleteId, adminDeleteAdmin_id);

        // 관리자가 아닌 경우 처리
        if (!adminCheck || adminCheck.length === 0) {
            return "No information found"; 
        }
        //  호스트 정보 삭제
        const adminHostDeleteInfoList = await adminDao.adminDeleteRealHost(adminDeleteId);

        return adminHostDeleteInfoList;
    } catch (err) {
        console.error("Error in adminDeleteHost:", err);
        throw err;
    }
};



module.exports = {
    adminSignup, adminLogin, adminGetUser, adminDeleteUser, adminGetHost, adminDeleteHost
};
