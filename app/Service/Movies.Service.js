import { reject, resolve } from 'bluebird'
import VerifyUser from '../Auth/VerifyUser'
import MovieRepository from '../DAO/MovieRepository'
import ReviewRepository from '../DAO/ReviewRepository'
/**
 * Checks if a link is a valid static image resource
 * @param {string} imagelink - url to image resource
 */
async function checkImageURL(imagelink) {
    let urlREGEX = new RegExp(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/)
    return urlREGEX.test(imagelink)
}
/**
 * Retrieves a list of all movies currently in database
 */
async function getAllMovies(){
    let allMovies = await MovieRepository.getAllMovies()
    return allMovies
}
/**
 * Retrieves movie of a specified id
 * @param {number} movie_id - Id of movie to get
 */
async function getMovie(movie_id){
    let movie = await MovieRepository.getMovieByMovieId(movie_id)
    return movie;
}
/**
 * Add new movie to the database after verifying moderator's token
 * @param {object} newMovie 
 * {title: string - movie title,
 *  cover: string - cover pictue URL,
 *  director: string - movie's director,
 *  premiere: year the movie premiered in cinemas}
 * @param {string} token - JWT authorization token
 */
async function addMovie(newMovie,token){
    let verificationResult = await VerifyUser.verifyToken(token,true)
    console.log(verificationResult)
    try{
        if(verificationResult.succes){
            let urlTest = await checkImageURL(newMovie.cover)
            if(!urlTest){
                return {succes: false, message: "Cover link is not a valid static resource"}
            } else {
                await MovieRepository.addMovie(newMovie)
                console.log("movie was added")
                return {succes: true, message: "Movie has been added succesfully"}
            }
        } else {
            console.log("cum")
            return verificationResult
        }
    } catch(error){
        console.log(error)
        return {succes: false, message: "An unexpected error has occured: "+error.message}
    }
}

/**
 * Updates existing movie in database after verifying moderator's token
 * @param {object} updatedMovie 
 * {movie_id: number - id of a movie to update,
 *  title: string - movie title,
 *  cover: string - cover pictue URL,
 *  director: string - movie's director,
 *  premiere: year the movie premiered in cinemas}
 * @param {string} token - JWT authorization token
 */
async function updateMovie(updatedMovie,token){
    let verificationResult = await VerifyUser.verifyToken(token,true)
    try{
        if(verificationResult.succes){
            let urlTest = await checkImageURL(newMovie.cover)
            if(!urlTest){
                return {succes: false, message: "Cover link is not a valid static resource"}
            } else {
                await MovieRepository.updateMovie(updatedMovie)
                return {succes: true, message: "Movie has been succesfully modified"}
            } 
        } else {
            return verificationResult
        }
    } catch(error){
        console.log(error)
        return {succes: false, message: "An unexpected error has occured: "+error.message}
    }
}
/**
 * Deletes movie with a specified id after verifying moderator's token
 * @param {object} toDelete {movie_id: number - id of a movie to delete}
 * @param {string} token JWT authorization token
 */
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
    getMovie: getMovie,
    addMovie: addMovie,
    updatedMovie: updateMovie,
    deleteMovie: deleteMovie
}