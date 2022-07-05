const userService = require("../service/userService");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const bcrypt = require("bcrypt");

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
    const { userId, password } = req.body;

     // 아이디 여부 확인
     const userIdRows = await userService.userIdCheck(userId);
     if (userIdRows.length < 1)
       return res.send(errResponse(baseResponse.SIGNIN_userID_WRONG));
 
     const selectUserID = userIdRows[0].user_id;
     console.log(selectUserID);
 
     // 비밀번호 확인
     const selectUserPasswordParams = [selectUserID];
     const passwordRows = await userService.passwordCheck(
       selectUserPasswordParams
     );

     
    if (!bcrypt.compareSync(password, passwordRows[0].password)) {
        return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
    }

    req.session.user = {
        userId: userId,
        nickname: selectUserID[0].nickname,
        is_logined: true,
        authorized: true,
    };

    const signInResponse = await userService.postSignIn(userId);

    return res.send(signInResponse);
}

