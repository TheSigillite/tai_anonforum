
import UserRepository from '../DAO/UserRepository';
import PasswordRepository from '../DAO/PasswordRepository';
import VerifyUser from '../Auth/VerifyUser'

/**
 * Registers new user in service
 * @param {object} newuser {login: string - username, passwd: string - an encrypted password (encryption algo does not matter)}
 */
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
/**
 * Checks if username and password belong to the same registered user and returns a JWT token
 * @param {object} userCredentials - {login: string - username, passwd: string - an encrypted password (has to be encrypted with the same algo as during register)}
 */
async function loginUser(userCredentials){
    let result = await VerifyUser.issueToken(userCredentials)
    return result
}

/**
 * Deletes token currently in use from the database
 * @param {string} userToken - JWT authorization token
 */
async function logoutUser(userToken){
    let result = await VerifyUser.logoutUser(userToken)
    return result
}


export default {
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser
}