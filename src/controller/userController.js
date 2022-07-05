const userService = require("../service/userService");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");

exports.signUp = async function (req, res) {
    const { userId, password, passwordCheck, nickname, name, age, gender, job } = req.body;

    //빈 값 확인
    if (!userId || !password || !passwordCheck || !nickname || !name || !age || !gender || !job) {
        return res.send(response(baseResponse.USER_INFO_EMPTY));
    }
    console.log(userId);

    // 아이디 중복 확인
    const userIdRows = await userService.userIdCheck(userId);
    if (userIdRows.length > 0)
        return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_userID));

    //비밀번호, 재입력 비밀번호 동일 여부 확인
    if (password != passwordCheck) {
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_CHECK));
    }

    let userInfo = {userId, password, passwordCheck, nickname, name, age, gender, job};
  
    const signUpResponse = await userService.createUser(
        userInfo
    );
  
    return res.send(signUpResponse);
}

exports.signIn = async function (req, res) {

}

