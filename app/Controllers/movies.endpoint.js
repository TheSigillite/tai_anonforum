
import MovieRepository from '../DAO/MovieRepository'
import TokenRepository from '../DAO/TokenRepository'
import UserRepository from '../DAO/UserRepository'
import jwt from 'jsonwebtoken';
import config from '../config';
import { response } from 'express';

const moviesEndpoint = (router) => {
    router.get('/movies/all', async (request,response,next) => {
        let result = await MovieRepository.getAllMovies();
        response.status(200).send(result)
    })

    router.post('/movies/new', async (request,response,next) => {
        let token = request.header('x-auth-token')
        if(token == undefined){
            let result = {succes:false, message: "You are not logged in"}
            response.status(407).send(result)
        } else { 
            TokenRepository.getTokenByTokenValue(token).then(tokenData => {
                if(tokenData == undefined){
                    let result = {succes:false, message: "This is not one of our tokens. HOW DID YOU GET IT?"}
                    response.status(407).send(result)
                } else {
                    let tokenBearer = jwt.verify(token,config.JwtSecret)
                    UserRepository.getUserById(tokenBearer.acc_id).then(user => {
                        if(!user.is_adm){
                            let result = {succes:false, message: "You are not authorized to perform this action"}
                            response.status(407).send(result)
                        } else {
                            MovieRepository.addMovie(request.body).then(() => {
                                let result = {succes:true, message: "Movie Added Succesfully"}
                                response.status(200).send(result)
                            })
                        }
                    })
                }
            })
        }
    })
}

export default moviesEndpoint