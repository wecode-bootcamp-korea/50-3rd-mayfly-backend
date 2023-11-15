const hostDao = require("../models/hostDao");
const hostVerifyToken = require("../middleware/auth");
const axios = require('axios');
const error = require('../middleware/error');
const dotenv = require('dotenv');
dotenv.config();

//전화번호 변환 함수
const phoneNumberConversion = (phoneNumber) => {
    // +82를 제거하고 남은 숫자만 추출
    const extrackPhoneNumber = phoneNumber.replace('+82 10', '');
    //010시작인지 확인하고 아니라면 +82 붙여주기(삼항연산) 후 -기호 추가
    const addSymbol = (extrackPhoneNumber.startsWith('010') ?
        extrackPhoneNumber : `010${extrackPhoneNumber}`)
        .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    return addSymbol;
}

// 회원가입 및 로그인
const hostSignup = async (code) => {
    try {
        const authToken = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                params:{
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_KEY,
                    code,
                    redirect_uri: process.env.KAKAO_HOST_URL
                }
            });
            const accessToken = authToken.data.access_token;
        // 카카오 API를 통해 사용자 정보 가져오기
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (!response || response.status !== 200) {
            error(400, '카카오 연결 안됨');
        }

        const { name, email, phone_number } = response.data.kakao_account;
        //전화번호 010으로 변환
        const changeFirstNumber = phoneNumberConversion(phone_number);

        // 이미 가입된 사용자인지 확인
        const hostData = await hostDao.checkHost(email);
        if (hostData.length === 0) {
            // 가입되지 않은 경우 회원가입
            const hostDataAdd = await hostDao.hostSignup(name, email, changeFirstNumber);
            // console.log("hostDataAdd :", hostDataAdd)
            // const newHostData = await hostDao.checkHost(email);
            // console.log("newHostData", newHostData);
            const tokenIssuance = hostDataAdd[0].id;
            const jwtToken = await hostVerifyToken.hostCreateToken(tokenIssuance, name, email, changeFirstNumber);
            return jwtToken;
        }

        // 이미 가입된 사용자인 경우 로그인 처리
        const tokenIssuance = hostData[0].id;
        const jwtToken = await hostVerifyToken.hostCreateToken(tokenIssuance, name, email, hostData[0].phone_number);
        return jwtToken;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

//호스트 정보 조회
const getHost = async (hostInfo) => {
    try {
        const getHostId = hostInfo.id;
        const getHostEmail = hostInfo.email;
        // 호스트 확인 및 정보 조회
        const hostInfoList = await hostDao.checkHost(getHostEmail);
        // 호스트가 존재하지 않는 경우 처리
        if (!hostInfoList || hostInfoList.length === 0) {
            error(400,'Host does not exist');
        }else if(hostInfoList[0].id !== getHostId ){
            error(400,'Invalid host ID');
        }
        // 호스트 정보 조회
        return hostInfoList;
    } catch (err) {
        console.error("Error in getHost:", err);
        throw err;
    }
};

//호스트 정보 수정
const updateHost = async(hostUpdateToken, hostUpdateInfo) => {
    try{
        const updateHostId = hostUpdateToken.id;
        const updateHostEmail = hostUpdateToken.email;
        // 호스트 확인 및 정보 조회
        const hostUpdateInfoList = await hostDao.checkHost(updateHostEmail);
        // 호스트가 존재하지 않는 경우 처리
        if(!hostUpdateInfoList || hostUpdateInfoList.length === 0) {
            error(400,'Host does not exist');
        }else if(hostUpdateInfoList[0].id !== updateHostId ){
            error(400,'Invalid host ID');
        }
        //호스트 정보 수정
        const hostUpdateList = await hostDao.hostUpdateByInfo(updateHostEmail, hostUpdateInfo);
        return hostUpdateList;
    }catch (err) {
        console.error("Error in updateHost:", err);
        throw err;
    }
};

//호스트 정보 삭제
const deleteHost = async (hostDeleteInfo) => {
    try {
        const deleteHostId = hostDeleteInfo.id;
        const deleteHostEmail = hostDeleteInfo.email;
        // 호스트 확인 및 정보 삭제
        const hostDeleteInfoList = await hostDao.checkHost(deleteHostEmail);
        // 호스트가 존재하지 않는 경우 처리
        if (!hostDeleteInfoList || hostDeleteInfoList.length === 0) {
            error(400,'Host does not exist'); 
        }else if(hostDeleteInfoList[0].id !== deleteHostId){
            error(400,'Invalid host ID');
        }
        // 호스트 정보 삭제
        const deleteByHost = await hostDao.deleteRealHost(deleteHostId, deleteHostEmail);
        return deleteByHost;
    } catch (err) {
        console.error("Error in deleteHost:", err);
        throw err;
    }
};


//호스트 크레딧 조회
const getHostCredit = async (hostCreditInfo) => {
    try {
        const getHostCreditId = hostCreditInfo.id;
        const getHostCreditEmail = hostCreditInfo.email;
        // 호스트 확인 및 크레딧 조회
        const hostCreditList = await hostDao.checkHost(getHostCreditId, getHostCreditEmail);
        // 호스트가 존재하지 않는 경우 처리
        if (!hostCreditList || hostCreditList.length === 0) {
            error(400,'Host does not exist');
        }else if(hostCreditList[0].id !== getHostCreditId ){
            error(400,'Invalid host ID');
        }
        // 호스트 크레딧 조회
        return hostCreditList;
    } catch (err) {
        console.error("Error in getHostCredit:", err);
        throw err;
    }
};



module.exports = {
    hostSignup, getHost, updateHost, deleteHost, getHostCredit
};
