const database = require("./datasource")

//관리자 확인
const realAdmin = async (id) => {
    const result = await database.appDataSource.query(
        `
    SELECT 
    id,
    admin_id
    FROM admins
    WHERE id = ?
    `, [id]
    );
    return result;
};

// 요청 이메일 존재 여부 확인
const checkAdmin = async (admin_id) => {

        const result = await database.appDataSource.query(
            `
        SELECT 
        id,
        admin_id,
        password
        FROM admins
        WHERE admin_id = ?
        `, [admin_id]
        );
        return result;
};

// 회원가입
const adminSignup = async (admin_id, password) => {

        const result = await database.appDataSource.query(
            `
            INSERT INTO admins (admin_id, password) 
            VALUES
            (? ,?)
            `, [admin_id, password]
        )
        return result;
};

// 로그인
const adminLogin = async (admin_id) => {
        const result = await database.appDataSource.query(
            `
        SELECT 
        id,
        admin_id
        FROM admins 
        WHERE admin_id = ?;
        `, [admin_id]
        );
        return result;
};

//유저 정보 조회
const adminGetRealUser = async () => {
    const adminRealUserCheck = await database.appDataSource.query(
        `
        SELECT
        id,
        name,
        email,
        phone_number,
        credit
        FROM users
        ORDER BY id ASC
        `)
        return adminRealUserCheck;
};

//유저 정보 삭제
const adminDeleteRealUser = async (id) => {
    const adminRealUserDelete = await database.appDataSource.query(
        `
        UPDATE
        users
        SET
        deleted_at = NOW()
        WHERE id = ?
        `, [id])
        return adminRealUserDelete;
};

//호스트 정보 조회
const adminGetRealHost = async () => {
    const adminRealHostCheck = await database.appDataSource.query(
        `
        SELECT
        id,
        name,
        email,
        phone_number,
        credit,
        bank_account
        FROM hosts
        ORDER BY id ASC
        `)
        return adminRealHostCheck;
};

//호스트 정보 삭제
const adminDeleteRealHost = async (id) => {
    const adminRealHostDelete = await database.appDataSource.query(
        `
        UPDATE
        hosts
        SET
        deleted_at = NOW()
        WHERE id = ?
        `,[id])
        return adminRealHostDelete;
};


module.exports = {
    realAdmin, checkAdmin, adminSignup, adminLogin, adminGetRealUser, adminDeleteRealUser, adminGetRealHost, adminDeleteRealHost
}

