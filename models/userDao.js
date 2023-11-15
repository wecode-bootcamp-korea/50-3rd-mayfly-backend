const database = require("./datasource")


// 요청 이메일 존재 여부 확인
const checkUser = async (email) => {
    
        const result = await database.appDataSource.query(
            `
        SELECT 
        id,
        name,
        email,
        phone_number,
        credit
        FROM users
        WHERE email = ?
        `, [email]
        );
        return result;
}


// 회원가입
const userSignup = async (name, email, phone_number) => {
        const result = await database.appDataSource.query(
            `
            INSERT INTO users (name, email, phone_number, credit, created_at) 
            VALUES (?, ?, ?, ?, NOW());
            `, [name, email, phone_number, 0]
        )
        return result;
}

//로그인
const userLogin = async (email) => {
    const result = await database.appDataSource.query(
        `
        SELECT
        id,
        name,
        email,
        phone_number
        FROM users
        WHERE email = ?
        `, [email]
    )
    return result;
};

// 유저 정보 수정
const userUpdateByInfo = async (email, { name, phone_number }) => {
    const userUpdateInfo = await database.appDataSource.query(
        `
        UPDATE users
        SET
        name = ?,
        phone_number = ?,
        updated_at = NOW()
        WHERE email = ? 
        `, [name, phone_number, email]
    );
    return userUpdateInfo;
};



// //유저 정보 조회
// const getRealUser = async (id,email) => {
//     const realUserCheck = await database.appDataSource.query(
//         `
//         SELECT
//         id,
//         name,
//         email,
//         phone_number
//         FROM users
//         WHERE id = ?
//         AND email =?
//         `, [id, email]
//         )
//         return realUserCheck;
// };

//유저 정보 삭제
const deleteRealUser = async (email) => {
    const realUserDelete = await database.appDataSource.query(
        `
        UPDATE
        users
        SET
        deleted_at = NOW()
        WHERE email = ?
        `, [email])
        return realUserDelete;
};

//유저 크레딧 조회
// const getRealUserCredit = async (id,email) => {
//     const realUserCreditCheck = await database.appDataSource.query(
//         `
//         SELECT
//         id,
//         name,
//         email,
//         credit
//         FROM users
//         WHERE id = ?
//         AND email =?
//         `, [id, email]
//         )
//         return realUserCreditCheck;
// };


module.exports = {
    checkUser, userSignup, userLogin, userUpdateByInfo, deleteRealUser
}

