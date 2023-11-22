const hostDao = require("../models/hostDao");
const hostVerifyToken = require("../middleware/auth");
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

const hostSignup = async (code) => {
    try {
        const authToken = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_KEY,
                code,
                redirect_uri: process.env.KAKAO_HOST_URL
            }
        });
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
        const hostData = await hostDao.checkHost(email);
        if (hostData.length === 0) {
            await hostDao.hostSignup(name, email, changeFirstNumber);
            const newHostData = await hostDao.checkHost(email);
            const tokenIssuance = newHostData[0].id;
            const jwtToken = await hostVerifyToken.hostCreateToken(tokenIssuance, name, email, changeFirstNumber);
            return jwtToken;
        }
        if (hostData[0].deleted_at !== null) {
            return error(400, '탈퇴한 회원입니다')
        };
        const tokenIssuance = hostData[0].id;
        const jwtToken = await hostVerifyToken.hostCreateToken(tokenIssuance, name, email, hostData[0].phone_number);
        return jwtToken;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getHost = async (hostId, hostEmail) => {
    try {
        const hostInfoList = await hostDao.checkHost(hostEmail);
        if (!hostInfoList || hostInfoList.length === 0) {
            error(400, 'Host does not exist');
        } else if (hostInfoList[0].id !== hostId) {
            error(400, 'Invalid host ID');
        };
        return hostInfoList;
    } catch (err) {
        console.error("Error in getHost:", err);
        throw err;
    };
};

const updateHost = async (hostId, hostEmail, hostUpdateInfo) => {
    try {
        const hostUpdateInfoList = await hostDao.checkHost(hostEmail);
        if (!hostUpdateInfoList || hostUpdateInfoList.length === 0) {
            error(400, 'Host does not exist');
        } else if (hostUpdateInfoList[0].id !== hostId) {
            error(400, 'Invalid host ID');
        };
        const hostUpdateList = await hostDao.hostUpdateByInfo(hostId, hostUpdateInfo);
        return hostUpdateList;
    } catch (err) {
        console.error("Error in updateHost:", err);
        throw err;
    };
};

const deleteHost = async (hostId, hostEmail) => {
    try {
        const hostDeleteInfoList = await hostDao.checkHost(hostEmail);
        if (!hostDeleteInfoList || hostDeleteInfoList.length === 0) {
            error(400, 'Host does not exist');
        } else if (hostDeleteInfoList[0].id !== hostId) {
            error(400, 'Invalid host ID');
        };
        if (hostDeleteInfoList[0].credit > 0) {
            error(400, 'HOST_CREDIT_ISSUE');
        };
        const checkHostClassByHostId = await hostDao.checkHostClassByHostId(hostId);
        if (checkHostClassByHostId.length > 0) {
            error(400, 'HOST_CLASS_ISSUE');
        };
        await hostDao.deleteRealHost(hostId);
        return ({ message: 'USER_DELETED_SUCCESS' });
    } catch (err) {
        console.error("Error in deleteHost:", err);
        throw err;
    }
};

const getHostCredit = async (hostId, hostEmail) => {
    try {
        const hostCreditList = await hostDao.checkHost(hostEmail);
        if (!hostCreditList || hostCreditList.length === 0) {
            error(400, 'Host does not exist');
        } else if (hostCreditList[0].id !== hostId) {
            error(400, 'Invalid host ID');
        };
        return hostCreditList;
    } catch (err) {
        console.error("Error in getHostCredit:", err);
        throw err;
    };
};

module.exports = {
    hostSignup, getHost, updateHost, deleteHost, getHostCredit
};
