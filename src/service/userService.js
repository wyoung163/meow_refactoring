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

exports.userIdCheck = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdCheckResult = await User.selectUserId(connection, userId);
    connection.release();
  
    return userIdCheckResult;
};

// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (userID, userPassword) {
  try {
    // 아이디 여부 확인
    const userIDRows = await userProvider.userIDCheck(userID);
    if (userIDRows.length < 1)
      return errResponse(baseResponse.SIGNIN_userID_WRONG);

    const selectuserID = userIDRows[0].userID;

    // 비밀번호 확인
    const selectUserPasswordParams = [selectuserID];
    const passwordRows = await userProvider.passwordCheck(
      selectUserPasswordParams
    );

    if (!bcrypt.compareSync(userPassword, passwordRows[0].userPassword)) {
      return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    // 계정 상태 확인
    const userInfoRows = await userProvider.accountCheck(userID);

    if (userInfoRows[0].status === "INACTIVE") {
      return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
    } else if (userInfoRows[0].status === "DELETED") {
      return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    }

    console.log(userInfoRows[0].userID); // DB의 userId

    //토큰 생성 Service
    let token = await jwt.sign(
      {
        userId: userInfoRows[0].userID,
      }, // 토큰의 내용(payload)
      secret_config.jwtsecret, // 비밀키
      {
        expiresIn: "365d",
        subject: "User",
      } // 유효 기간 365일
    );

    return response(baseResponse.SUCCESS, {
      userId: userInfoRows[0].id,
      jwt: token,
    });
  } catch (err) {
    logger.error(
      `App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(
        err
      )}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};
