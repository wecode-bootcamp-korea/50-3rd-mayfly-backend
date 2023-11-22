const database = require("./datasource")


const checkUser = async (email) => {
    const result = await database.appDataSource.query(
        `
        SELECT 
        id,
        name,
        email,
        phone_number,
        credit,
        deleted_at
        FROM users
        WHERE email = ?
        `, [email]
    );
    return result;
}

const userSignup = async (name, email, phone_number, accessToken, refreshToken) => {
    const result = await database.appDataSource.query(
        `
            INSERT INTO users (name, email, phone_number, credit, created_at, access_token, refresh_token) 
            VALUES (?, ?, ?, ?, NOW(), ?, ?);
            `, [name, email, phone_number, 0, accessToken, refreshToken]
    )
    return result;
};

const updateToken = async (accessToken, refreshToken, email) => {
    const updateByToken = database.appDataSource.query(`
        UPDATE users
        SET
        access_token = ?,
        refresh_token = ?
        WHERE email = ?
    `, [accessToken, refreshToken, email]);
    return updateByToken
};

const userUpdateByInfo = async (userId, { name, phone_number }) => {
    const userUpdateInfo = await database.appDataSource.query(
        `
        UPDATE users
        SET
        name = ?,
        phone_number = ?,
        updated_at = NOW()
        WHERE id = ?
        `, [name, phone_number, userId]
    );
    return userUpdateInfo;
};

const checkUserSchedulByUserId = async (userId) => {
    const query = `
    SELECT
        classes.id,
        classes.title,
        schedules.class_day,
        schedules.class_hour
    FROM
        users
    JOIN
        orders ON users.id = orders.user_id
    JOIN
        classes ON orders.class_id = classes.id
    JOIN
        schedules ON classes.id = schedules.class_id
    JOIN
        places ON classes.place_id = places.id
    WHERE
        users.id = ?
    AND schedules.status = 1
    GROUP BY
        schedules.id;
    `;
    return await database.appDataSource.query(query, [userId]);
}

const userDeleteByInfo = async (userId) => {
    return await database.appDataSource.query(`UPDATE users SET deleted_at = NOW() WHERE id = ?`, [userId]);
};
module.exports = {
    checkUser,
    userSignup,
    userUpdateByInfo,
    checkUserSchedulByUserId,
    userDeleteByInfo,
    updateToken
}

