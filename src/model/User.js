async function selectUserId(connection, userId) {
    const selectUserIdQuery = `
        SELECT *
        FROM User
        WHERE user_id = ?`;
    const [UserIdRows] = await connection.query(selectUserIdQuery, [userId]);
    return UserIdRows;
}

async function insertUserInfo(connection, userInfo) {
    const insertUserInfoQuery = `
        INSERT INTO user(user_id, name, nickname, password, age, gender, job) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [UserInfoRows] = await connection.query(insertUserInfoQuery,
        [userInfo[0].userId, userInfo[0].name, userInfo[0].nickname, userInfo[0].password, userInfo[0].age, userInfo[0].gender, userInfo[0].job]);
    return UserInfoRows;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
        SELECT user_id, password
        FROM User
        WHERE user_id = ?`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        [selectUserPasswordParams]
    );
    return selectUserPasswordRow;
}

// async function selectUserAccount(connection, userID) {
//     const selectUserAccountQuery = `
//         SELECT status, userID
//         FROM User
//         WHERE userID = ?;`;

//     const selectUserAccountRow = await connection.query(
//         selectUserAccountQuery,
//         userID
//     );
//     return selectUserAccountRow[0];
// }


module.exports = {
    selectUserId,
    insertUserInfo,
    selectUserPassword,
    // selectUserAccount
};

