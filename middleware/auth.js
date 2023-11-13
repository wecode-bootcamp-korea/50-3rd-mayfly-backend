const token = require("jsonwebtoken");
const secretkey = process.env.TYPEORM_SECRETKEY
const bcrypt = require("bcrypt");
// 패스워드 암호화
const makehash = async(password, saltRound) => {
    return await bcrypt.hash(password, saltRound);
}
//패스워드 복호화
const decode = async(password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
// adminVerify토큰 검증
const adminVerifyToken  = async (req, res, next) => {
    const jwtToken = req.headers.authorization
    if(!jwtToken){
        res.status(403).json({message : "권한이 없습니다"})
    }else{
        try{
            const decoded = await adminTokenDecode(jwtToken, secretkey);
            req.admin = decoded;
            next();
        }catch(err){
            return res.status(403).json({message : "권한이 없습니다"})
        }
    }
}
// 토큰 검증
const adminTokenDecode = async(jwtToken, secretkey) => {
    return token.verify(jwtToken, secretkey);
}
const adminCreateToken = async(id, admin_id) => {
    const payload = {id, admin_id};
    return token.sign(payload, secretkey)
}
// userVerify토큰 검증
const userVerifyToken  = async (req, res, next) => {
    const jwtToken = req.headers.authorization;
    if(!jwtToken){
        res.status(403).json({message : "권한이 없습니다"})
    }else{
        try{
            const decoded = await userTokenDecode(jwtToken, secretkey);
            req.user = decoded;
            next();
        }catch(err){
            return res.status(403).json({message : "권한이 없습니다"})
        }
    }
}
// 토큰 검증
const userTokenDecode = async(jwtToken, secretkey) => {
    return token.verify(jwtToken, secretkey);
}
const userCreateToken = async(id, email) => {
    const payload = {id, email};
    return token.sign(payload, secretkey)
}
// hostVerify토큰 검증
const hostVerifyToken  = async (req, res, next) => {
    const jwtToken = req.headers.authorization;
    if(!jwtToken){
        res.status(403).json({message : "권한이 없습니다"})
    }else{
        try{
            const decoded = await hostTokenDecode(jwtToken, secretkey);
            req.host = decoded;
            next();
        }catch(err){
            return res.status(403).json({message : "권한이 없습니다"})
        }
    }
}
// 토큰 검증
const hostTokenDecode = async(jwtToken, secretkey) => {
    return token.verify(jwtToken, secretkey);
}
const hostCreateToken = async(id, email) => {
    const payload = {id, email};
    return token.sign(payload, secretkey)
}
module.exports = {
    adminVerifyToken, adminTokenDecode, adminCreateToken, userVerifyToken, userTokenDecode, userCreateToken,
    hostVerifyToken, hostTokenDecode, hostCreateToken, makehash, decode
}