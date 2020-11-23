
import config from '../config';
import UserRepository from '../DAO/UserRepository'
import PasswordRepository from '../DAO/PasswordRepository'
import TokenRepository from '../DAO/TokenRepository'
import jwt from 'jsonwebtoken';
import { response } from 'express';


const userEndpoint = (router) => {
    router.post('/users/register',async (request,response,next) =>{
        console.log(request.body)
        UserRepository.getUserByLogin(request.body.login).then(existingLogin => {
            if(existingLogin==undefined){
                UserRepository.newUser(request.body).then(newuserid => {
                    PasswordRepository.savePassword(request.body,newuserid).then(() =>{
                        let result = {succes:true, message: "Registration succesfull. You will be redirected to login"}
                        response.status(200).send(result)
                    })
                    
                })
            } else {
                let result = {succes: false, message: "This login is already taken"}
                response.status(406).send(result)
            }
        })
    });

    router.post('/users/login',async (request,response,next) => {
        console.log(request.body)
        UserRepository.getUserByLogin(request.body.login).then(userData => {
            if(userData==undefined){
                let result = {succes: false, message: "Account of this name does not exist"}
                response.status(404).send(result)
            } else {
                PasswordRepository.getPassword(userData.acc_id).then(userPasswd => {
                    if(userPasswd.passwd===request.body.passwd){
                        //let result = {succes: true, message: "pass ok"}
                        //response.status(200).send(result)
                        let tokenData={acc_id: userData.acc_id, login: userData.login, passwd: userPasswd.passwd}
                        let tokenJWT = jwt.sign(tokenData,config.JwtSecret,{expiresIn: '3h'})
                        TokenRepository.saveToken({acc_id: userData.acc_id, create_time: Math.floor(Date.now()/1000), type: 'auth', value: tokenJWT}).then(() => {
                            let result = {is_adm: userData.is_adm, token: tokenJWT}
                            response.status(200).send(result)
                        })
                    } else {
                        let result = {succes: false, message: "Username or password mismatch"}
                        response.status(404).send(result)
                    }
                })
            }
        })
    })

    router.post('/users/logout',async (request,response,next) => {
        let token = request.header('x-auth-token')
        let tokenBearer = jwt.verify(token,config.JwtSecret)
        console.log(tokenBearer)
        TokenRepository.deleteToken(tokenBearer.acc_id).then(() => {
            let result = {succes:true, message: "You have been logged out"}
            response.status(200).send(result)
        })
    })
}

export default userEndpoint
//result = {succes:true, message: "Registration succesfull. You will be redirected to login"}
//result = {succes: false, message: "This login is already taken"}
//    "login": "TestUser",
//    "passwd": "f9c57e84c62be16e069c4272eebc40e24f9133f0" - SHA1 for TestPass
//TestUser2
//TestPass2 584cef0e7e263cd91774da397c35d9696496bd40