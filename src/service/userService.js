// const { logger } = require("../../../config/winston");
const { pool } = require("../../config/db");
const User = require("../model/User");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const bcrypt = require("bcrypt");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createUser = async function (userInfo) {
  try {
    // 비밀번호 암호화
    const encryptedPassword = bcrypt.hashSync(userInfo.password, 10);
    userInfo.password = encryptedPassword;

    const insertUserInfoParams = [userInfo];

    const connection = await pool.getConnection(async (conn) => conn);

    const userIdResult = await User.insertUserInfo(
      connection,
      insertUserInfoParams
    );

    // console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
    connection.release();
    return response(baseResponse.SUCCESS, userInfo.userId);
  } catch (err) {
    // logger.error(`App - createUser Service error\n: ${err.message}`);
    console.log(err);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (userId) {
  try {
    const redirect_url = "localhost:3000/"
    return response(baseResponse.SUCCESS, {
      userId: userId,
      url: redirect_url
    });
  } catch (err) {
    // logger.error(
    //   `App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(
    //     err
    //   )}`
    // );
    console.log(err);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.userIdCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdCheckResult = await User.selectUserId(connection, userId);
  connection.release();

  return userIdCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await User.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

// exports.accountCheck = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userAccountResult = await userDao.selectUserAccount(connection, userId);
//   connection.release();

//   return userAccountResult;
// };