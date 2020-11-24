
import UserRepository from '../DAO/UserRepository';
import PasswordRepository from '../DAO/PasswordRepository';
import VerifyUser from '../Auth/VerifyUser'

async function registerUser(newuser){
    let existingLogin = await UserRepository.getUserByLogin(newuser.login)
    if(existingLogin==undefined){
        let newuserid = await UserRepository.newUser(newuser)
        await PasswordRepository.savePassword(newuser,newuserid)
        let result = {succes:true, message: "Registration succesfull. You will be redirected to login"}
        return result
    } else {
        let result = {succes: false, message: "This login is already taken"}
        return result
    }
}

async function loginUser(userCredentials){
    let result = await VerifyUser.issueToken(userCredentials)
    return result
}

async function logoutUser(userToken){
    let result = await VerifyUser.logoutUser(userToken)
    return result
}


export default {
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser
}