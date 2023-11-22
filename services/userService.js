const userDao = require("../models/userDao");
const userVerifyToken = require("../middleware/auth");
const axios = require('axios');
const { error } = require('../middleware/error');
const dotenv = require('dotenv');
dotenv.config();


const phoneNumberConversion = (phoneNumber) => {
    const extrackPhoneNumber = phoneNumber.replace('+82 10', '');
    const addSymbol = (extrackPhoneNumber.startsWith('010') ?
        extrackPhoneNumber : `010${extrackPhoneNumber}`)
        .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    return addSymbol;
};

const userSignup = async (code) => {
    try {
        const authToken = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_KEY,
                code,
                redirect_uri: process.env.KAKAO_USER_URL
            }
        });
        const refreshToken = authToken.data.refresh_token;
        const accessToken = authToken.data.access_token;
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${accessToken}`
            },
        });
        if (!response || response.status !== 200) {
            error(400, '카카오 연결 안됨');
        };
        const { name, email, phone_number } = response.data.kakao_account;
        const changeFirstNumber = phoneNumberConversion(phone_number);
        const userData = await userDao.checkUser(email);
        if (userData.length === 0) {
            await userDao.userSignup(name, email, changeFirstNumber, accessToken, refreshToken);
            const newUserData = await userDao.checkUser(email);
            const tokenIssuance = newUserData[0].id;
            const jwtToken = await userVerifyToken.userCreateToken(tokenIssuance, name, email, changeFirstNumber);
            return jwtToken;
        };
        console.log(userData[0].deleted_at)
        if (userData[0].deleted_at !== null) {
            return error(400, '탈퇴한 회원입니다');
        };
        await userDao.updateToken(accessToken, refreshToken, email);
        const tokenIssuance = userData[0].id;
        const jwtToken = await userVerifyToken.userCreateToken(tokenIssuance, name, email, userData[0].phone_number);
        return jwtToken;
    } catch (err) {
        console.error(err);
        throw err;
    };
};

const getUserByInfo = async (userId, userEmail) => {
    try {
        const userGetInfoList = await userDao.checkUser(userEmail);
        if (!userGetInfoList || userGetInfoList.length === 0) {
            error(400, 'User does not exist');
        } else if (userGetInfoList[0].id !== userId) {
            error(400, 'Invalid user ID');
        };
        return userGetInfoList;
    } catch (err) {
        console.error("Error in getUser:", err);
        throw err;
    };
};

const updateUser = async (userId, userEmail, userUpdateInfo) => {
    try {
        const userUpdateByCheck = await userDao.checkUser(userEmail);
        if (!userUpdateByCheck || userUpdateByCheck.length === 0) {
            error(400, 'User does not exist');
        } else if (userUpdateByCheck[0].id !== userId) {
            error(400, 'Invalid user ID');
        };
        const userUpdateList = await userDao.userUpdateByInfo(userId, userUpdateInfo);
        return userUpdateList;
    } catch (err) {
        console.error("Error in updateUser:", err);
        throw err;
    };
};

const deleteUserByInfo = async (userId, userEmail) => {
    try {
        const userDeleteInfoList = await userDao.checkUser(userEmail);
        if (!userDeleteInfoList || userDeleteInfoList.length === 0) {
            error(400, 'User does not exist');
        } else if (userDeleteInfoList[0].id !== userId) {
            error(400, 'Invalid user ID');
        };
        if (userDeleteInfoList[0].credit > 0) {
            error(400, 'USER_CREDIT_ISSUE')
        };
        const checkUserSchedulByUserId = await userDao.checkUserSchedulByUserId(userId);
        if (checkUserSchedulByUserId.length > 0) {
            error(400, 'USER_SCHEDULE_ISSUE')
        };
        await userDao.userDeleteByInfo(userId);
        return ({ message: 'USER_DELETED_SUCCESS' });
    } catch (err) {
        console.error("Error in deleteUser:", err);
        throw err;
    };
};

const getUserByCredit = async (userId) => {
    try {
        const userCreditList = await userDao.checkUser(userId);
        if (!userCreditList || userCreditList.length === 0) {
            error(400, 'User does not exist');
        } else if (userCreditList[0].id !== userId) {
            error(400, 'Invalid user ID');
        };
        return userCreditList;
    } catch (err) {
        console.error("Error in getUserCredit:", err);
        throw err;
    };
};

module.exports = {
    userSignup, getUserByInfo, updateUser, deleteUserByInfo, getUserByCredit
};
