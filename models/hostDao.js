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
        `, [email]);
    return result;
};
// 회원가입
const hostSignup = async (name, email, phone_number) => {
    const result = await database.appDataSource.query(
        `
            INSERT INTO hosts (name, email, phone_number, credit, created_at) 
            VALUES (?, ?, ?, ?, NOW());
            `, [name, email, phone_number, 0]);
    return result;
};
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
        `, [email]);
    return result;
};
// 호스트 정보 수정
const hostUpdateByInfo = async (email, { name, phone_number, bank_account }) => {
    const hostUpdateInfo = await database.appDataSource.query(
        `
        UPDATE hosts
        SET
        name = ?,
        phone_number = ?,
        bank_account = ?,
        updated_at = NOW()
        WHERE email = ?
        `, [name, phone_number, bank_account, email]);
    return hostUpdateInfo
};
// 호스트 강의 스케줄 확인
const checkHostSchedulByHostId = async (hostId) => {
    const query = `
    SELECT
        schedules.id,
        classes.id,
        classes.title,
        schedules.max_member,
        schedules.enrolled_member
    FROM schedules
    JOIN classes ON schedules.class_id = classes.id
    JOIN hosts ON classes.host_id = hosts.id
    WHERE hosts.id = ?
    AND schedules.enrolled_member > 0
    ORDER BY schedules.class_day`;
    return database.appDataSource.query(query, [hostId]);
};
// 호스트 강의 삭제
const deleteHostClassByHostEmail = async (email) => {
    return await database.appDataSource.query(`UPDATE classes SET deleted_at = NOW() WHERE host_id IN (SELECT id FROM hosts WHERE email = ?)`, [email])
};
// // 호스트 강의 장소 삭제 1
// const updateClassesPlaceIdByHostEmai = async (email) => {
//     return await database.appDataSource.query(`
//     UPDATE classes
//     SET place_id = NULL
//     WHERE host_id IN (SELECT id FROM hosts WHERE email = ?)
//     `, [email])
// };
// // 호스트 강의 장소 삭제 2
// const deletePlaceByHostEmail = async (email) => {
//     return await database.appDataSource.query(`
//     DELETE FROM places
//     WHERE id IN 
//     (SELECT place_id FROM classes WHERE host_id IN 
//     (SELECT id FROM hosts WHERE email = ?))
//     `, [email])
// };
// 호스트 강의 이미지 삭제
const deleteHostClassImgByHostEmail = async (email) => {
    return await database.appDataSource.query(`
    UPDATE images
    SET deleted_at = NOW()
    WHERE class_id IN (
    SELECT id
    FROM classes
    WHERE host_id = (SELECT id FROM hosts WHERE email = ?))
`, [email]);
};
// 호스트 강의 좋아요 삭제
const deleteHostClassLikeByHostEmail = async (email) => {
    return await database.appDataSource.query(`
    DELETE likes
    FROM likes
    JOIN classes ON likes.class_id = classes.id
    JOIN hosts ON classes.host_id = hosts.id
    WHERE hosts.email = ?
    `, [email])
};
// 호스트 정보 삭제
const deleteRealHost = async (email) => {
    return await database.appDataSource.query(`UPDATE hosts SET deleted_at = NOW() WHERE email = ?`, [email]);
};

module.exports = {
    checkHost,
    hostSignup,
    hostLogin,
    hostUpdateByInfo,
    checkHostSchedulByHostId,
    // updateClassesPlaceIdByHostEmai,
    // deletePlaceByHostEmail,
    deleteHostClassByHostEmail,
    deleteHostClassImgByHostEmail,
    deleteHostClassLikeByHostEmail,
    deleteRealHost
}

