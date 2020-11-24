import { reject, resolve } from 'bluebird'
import VerifyUser from '../Auth/VerifyUser'
import MovieRepository from '../DAO/MovieRepository'
import ReviewRepository from '../DAO/ReviewRepository'

async function getAllMovies(){
    let allMovies = await MovieRepository.getAllMovies()
    return allMovies
}

async function addMovie(newMovie,token){
    let verificationResult = await VerifyUser.verifyToken(token,true)
    console.log(verificationResult)
    try{
        if(verificationResult.succes){
            await MovieRepository.addMovie(newMovie)
            console.log("movie was added")
            return {succes: true, message: "Movie has been added succesfully"}
        } else {
            console.log("cum")
            return verificationResult
        }
    } catch(error){
        console.log(error)
        return {succes: false, message: "An unexpected error has occured: "+error.message}
    }
}

async function updateMovie(updatedMovie,token){
    let verificationResult = await VerifyUser.verifyToken(token,true)
    try{
        if(verificationResult.succes){
            await MovieRepository.updateMovie(updatedMovie)
            return {succes: true, message: "Movie has been succesfully modified"}
        } else {
            return verificationResult
        }
    } catch(error){
        console.log(error)
        return {succes: false, message: "An unexpected error has occured: "+error.message}
    }
}

async function deleteMovie(toDelete,token){
    let verificationResult = await VerifyUser.verifyToken(token,true)
    try{
        if(verificationResult.succes){
            await MovieRepository.deleteMovie(toDelete.movie_id)
            await ReviewRepository.deleteAllMoviesReviews(toDelete.movie_id)
            return {succes: true, message: "Movie and all of it's reviews have been deleted"}
        } else {
            return verificationResult
        }
    } catch(error){
        console.log(error)
        return {succes: false, message: "An unexpected error has occured: "+error.message}
    }
}

export default {
    getAllMovies: getAllMovies,
    addMovie: addMovie,
    updatedMovie: updateMovie,
    deleteMovie: deleteMovie
}