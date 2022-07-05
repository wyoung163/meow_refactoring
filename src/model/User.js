async function selectUserId(connection, userId) {
    const selectUserIdQuery = `
                  SELECT user_id
                  FROM User
                  WHERE user_id = ?`;
    const [UserIdRows] = await connection.query(selectUserIdQuery, userId);
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

module.exports = {
    selectUserId,
    insertUserInfo
  };
  
