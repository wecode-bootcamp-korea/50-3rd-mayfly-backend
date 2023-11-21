const adminDao = require("../models/adminDao");
const adminVerifyToken = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { error } = require("../middleware/error");

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
        return jwtToken;
    } catch (err) {
        console.error("An error occurred during login:", err);
        throw err;
    }
};
//하루 모든유저 리스트 가져다주기
const getUsersList = async(adminId) => {
    try {
        //관리자 계정 일치하는지 확인 (토큰과 DB)
        const [esistingAdmin] = await adminDao.checkAdmin(adminId);
        if(esistingAdmin.admin_id !== adminId){
            error(400,'ADMIN_ID_NOT_MATCH')
        };
        //전체하루 리스트 갖다주기  
        const result = adminDao.getUsersList();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    };
};
//하루 해당 유저 강퇴
const deleteUserByUserId = async(adminId,userId) => {
    try {
        //관리자 계정 일치하는지 확인 (토큰과 DB)
        const [esistingAdmin] = await adminDao.checkAdmin(adminId);
        if(esistingAdmin.admin_id !== adminId){
            error(400,'ADMIN_ID_NOT_MATCH')
        };
        //해당 하루유저 크레딧 있는지 확인하기
        const checkUserCreditByUserId = await adminDao.checkUserCreditByUserId(userId);
        if(checkUserCreditByUserId.length > 0){
            error(400,'USER_CREDIT_ISSUE')
        };
        //해당 하루유저 신청강의 스케줄 있는지 확인하기
        const checkUserScheduleByUserId = await adminDao.checkUserScheduleByUserId(userId);
        if(checkUserScheduleByUserId.length > 0){
            error(400,'USER_SCHEDULE_ISSUE')
        };
        //유저 강퇴 (soft)
        await adminDao.deleteUserByUserId(userId);
        //좋아요 삭제 (hard)
        await adminDao.deleteLikesByUserId(userId);
        return ({message: 'USER_DELETED_SUCCESS'});
    } catch (err) {
        console.error(err);
        throw err;
    };
};
//하루 해당 유저 복원
const restoreUserByUserId = async(adminId, userId) => {
    try{
        //관리자 계정 일치하는지 확인 (토큰과 DB)
        const [existingAdmin] = await adminDao.checkAdmin(adminId);
        if(existingAdmin.admin_id !== adminId){
            error(400,'ADMIN_ID_NOT_MATCH')
        };
        //해당 하루 유저 존재 할 때 에러처리
        const checkExistenceUser = await adminDao.getUsersList(userId);
        if(!checkExistenceUser){
            error(400, 'USER_EXISTS')
        };
        await adminDao.restoreUserId(userId);
        return ({message: 'USER_RESTORE_SUCCESS'})
    } catch (err) {
        console.error(err);
        throw err;
    };
};
//등대 모든등대 리스트 가져다주기
const getHostsList = async(adminId) => {
    try {
        //관리자 계정 일치하는지 확인 (토큰과 DB)
        const [esistingAdmin] = await adminDao.checkAdmin(adminId);
        if(esistingAdmin.admin_id !== adminId){
            error(400,'ADMIN_ID_NOT_MATCH')
        };
        //전체하루 리스트 갖다주기  
        const result = adminDao.getHostsList();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    };
};
//등대 해당 유저 강퇴
const deleteHostByHostId = async (adminId,hostId) => {
    try {
        //관리자 계정 일치하는지 확인 (토큰과 DB)
        const [esistingAdmin] = await adminDao.checkAdmin(adminId);
        if(esistingAdmin.admin_id !== adminId){
            error(400,'ADMIN_ID_NOT_MATCH')
        };
        //해당 등대유저 크레딧 있는지 확인하기
        const checkHostCreditByUserId = await adminDao.checkHostCreditByHostId(hostId);
        if(checkHostCreditByUserId.length > 0){
            error(400,'HOST_CREDIT_ISSUE')
        };
        //해당 등대유저 수강예정 스케줄 있는지 확인하기
        const checkHostScheduleByUserId = await adminDao.checkHostScheduleByHostId(hostId);
        if(checkHostScheduleByUserId.length > 0){
            error(400,'HOST_SCHEDULE_ISSUE')
        };
        //해당 등대유저 강의 삭제 (soft)
        await adminDao.deleteHostClassByHostId(hostId);
        //해당 등대유저 강퇴(soft)
        await adminDao.deleteHostInfoByHostId(hostId);
        return ({message: 'HOST_DELETED_SUCCESS'});
    } catch (err) {
        console.error(err);
        throw err;
    };
};
//등대 해당 유저 복원
const restoreHostByHostId = async (adminId, hostId) => {
    try{
        //관리자 계정 일치하는지 확인 (토큰과 DB)
        const [existingAdmin] = await adminDao.checkAdmin(adminId);
        if(existingAdmin.admin_id !== adminId){
            error(400,'ADMIN_ID_NOT_MATCH')
        };
        //해당 하루 유저 존재 확인
        const checkExistenceHost = await adminDao.getHostsList(hostId);
        if(!checkExistenceHost){
            error(400, 'HOST_EXISTS')
        };
        await adminDao.restoreHostId(hostId);
        return ({message: 'HOST_RESTORE_SUCCESS'})
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
