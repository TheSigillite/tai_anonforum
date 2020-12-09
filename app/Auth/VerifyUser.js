import UserRepository from '../DAO/UserRepository'
import PasswordRepository from '../DAO/PasswordRepository'
import TokenRepository from '../DAO/TokenRepository'
import jwt from 'jsonwebtoken';
import config from '../config';

async function verfyToken(tokenJWT,moderatorAction){
    try{
        let tokenData = await TokenRepository.getTokenByTokenValue(tokenJWT)
        console.log("TokenData "+tokenData)
        if(tokenData == undefined){
            return {succes:false, message: "Token you use is not one of our tokens. HOW DID YOU GET IT?"}
        } else if(tokenData.type !== 'auth'){
            return {succes:false, message: "This token cannot be used for this purpouse"}
        } else {
            let tokenBearer = jwt.verify(tokenJWT,config.JwtSecret)
            let user = await UserRepository.getUserById(tokenBearer.acc_id)
            if(user==undefined){
                return {succes:false, message: "What..."}
            } else {
                if(moderatorAction){
                    console.log("mod action "+user)
                    if(user.is_adm){
                        return {succes: true, user: user}
                    } else {
                       return {succes: false, message: "You are not authorized to perform this action"}
                    } 
                } else {
                    return {succes: true, user: user}
                }
            }
        }
    } catch(err){
        switch(err.name){
            case 'TokenExpiredError':
                await TokenRepository.deleteToken(tokenJWT)  
                return {succes: false, message: "Your login session has expired. Please login again"}     
            case 'JsonWebTokenError':
                return {succes: false, message: "Your token is malformed."}
            default:
                return {succes: false, message: "An unexpected error has occured: "+err.message}
        }
    }
}

async function issueToken(loginCredentials){
    let userData = await UserRepository.getUserByLogin(loginCredentials.login)
    if(userData==undefined){
        return {succes: false, message: "Account of this name does not exist"}
    } else {
        let userPasswd = await PasswordRepository.getPassword(userData.acc_id)
        if(userPasswd.passwd===loginCredentials.passwd){
            //let result = {succes: true, message: "pass ok"}
            //response.status(200).send(result)
            let tokenData={acc_id: userData.acc_id, login: userData.login, passwd: userPasswd.passwd, createTime: Date.now()}
            await TokenRepository.deleteAuthTokensByAcc_id(userData.acc_id)
            let tokenJWT = jwt.sign(tokenData,config.JwtSecret,{expiresIn: '3h'})
            await TokenRepository.saveToken({acc_id: userData.acc_id, create_time: Math.floor(Date.now()/1000), type: 'auth', value: tokenJWT})
            return {succes: true ,tokenPack:{is_adm: userData.is_adm, token: tokenJWT}}
        } else {
            return {succes: false, message: "Username or password mismatch"}
        }
    }
}

async function logoutUser(tokenJWT){
    try{
        let tokenBearer = jwt.verify(tokenJWT,config.JwtSecret)
        console.log(tokenBearer)
        let token = await TokenRepository.getTokenByTokenValue(tokenJWT)
        if(token==undefined){
            return {succes: true, message: "You have been logged out"}
        } else if (token.type !== 'auth'){
            return {succes: false, message: "Supplied token is unsuitable for this action. Please contact the developer"}
        } else {
            await TokenRepository.deleteToken(tokenJWT)
            return {succes: true, message: "You have been logged out"}
        }
    } catch(err) {
        switch(err.name){
            case 'TokenExpiredError':
                await TokenRepository.deleteToken(tokenJWT)
                return {succes: false, message: "Your login session has expired. Please login again"}
            case 'JsonWebTokenError':
                return {succes: false, message: "Your token is malformed."}
            default:
                return {succes: false, message: "An unexpected error has occured: "+err.message}
        }
    }
    
}

export default {
    verifyToken: verfyToken,
    issueToken: issueToken,
    logoutUser: logoutUser
}