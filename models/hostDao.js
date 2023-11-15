const database = require("./datasource")


// 요청 이메일 존재 여부 확인
const checkHost = async (email) => {
    
        const result = await database.appDataSource.query(
            `
        SELECT 
        id,
        name,
        email,
        phone_number,
        credit,
        bank_account
        FROM hosts
        WHERE email = ?
        `, [email]
        );
        return result;
}


// 회원가입
const hostSignup = async (name, email, phone_number) => {
        const result = await database.appDataSource.query(
            `
            INSERT INTO hosts (name, email, phone_number, credit, created_at) 
            VALUES (?, ?, ?, ?, NOW());
            `, [name, email, phone_number, 0]
        )
        return result;
}

//로그인
const hostLogin = async (email) => {
    const result = await database.appDataSource.query(
        `
        SELECT
        id,
        name,
        email,
        phone_number
        FROM hosts
        WHERE email = ?
        `, [email]
    )
    return result;
};

// 호스트 정보 수정
const hostUpdateByInfo = async(email, {name, phone_number, bank_account}) => {
    const hostUpdateInfo = await database.appDataSource.query(
        `
        UPDATE hosts
        SET
        name = ?,
        phone_number = ?,
        bank_account = ?,
        updated_at = NOW()
        WHERE email = ?
        `, [name, phone_number, bank_account, email]
    )
    return hostUpdateInfo
};


// //호스트 정보 조회
// const getRealHost = async (id,email) => {
//     const realHostCheck = await database.appDataSource.query(
//         `
//         SELECT
//         id,
//         name,
//         email,
//         phone_number
//         FROM hosts
//         WHERE id = ?
//         AND email =?
//         `, [id, email]
//         )
//         return realHostCheck;
// };

//유저 정보 삭제
const deleteRealHost = async (email) => {
    const realHostDelete = await database.appDataSource.query(
        `
        UPDATE
        hosts
        SET
        deleted_at = NOW()
        WHERE email = ?
        `, [email])
        return realHostDelete;
};

//호스트 크레딧 조회
// const getRealHostCredit = async (id,email) => {
//     const realHostCreditCheck = await database.appDataSource.query(
//         `
//         SELECT
//         id,
//         name,
//         email,
//         credit
//         FROM hosts
//         WHERE id = ?
//         AND email =?
//         `, [id, email]
//         )
//         return realHostCreditCheck;
// };

module.exports = {
    checkHost, hostSignup, hostLogin, hostUpdateByInfo, deleteRealHost
}

