
import VerifyUser from '../Auth/VerifyUser'
import ReviewRepository from '../DAO/ReviewRepository'
import UserRepository from '../DAO/UserRepository'
/**
 * Retrieves reviews for a movie
 * @param {number} movie_id - id of a movie
 */
async function getMovieReviews(movie_id){
    let reviewsRaw = await ReviewRepository.getMovieReviews(movie_id)
    var reviewsDone = []
    for(i=0;i<reviewsRaw.length;i++){
        var review = reviewsRaw[i]
        var poster = await UserRepository.getUserById(review.acc_id)
        reviewsDone.push({rev_id: review.rev_id, author: poster.login, rev: review.rev})
    }
    return reviewsDone
}
/**
 * Adds New Review after verification
 * @param {object} newReview - {movie_id: number - id of movie, rev: string - review text}
 * @param {string} token - JWT Token 
 */
async function addNewReview(newReview,token){
    let verificationResult = await VerifyUser.verifyToken(token,false)
    try{
        if(verificationResult.succes){
            await ReviewRepository.newReview({movie_id: newReview.movie_id, acc_id: verificationResult.acc_id, rev: newReview.rev})
            return {succes: true, message: "Your review has been added."}
        } else {
            return verificationResult
        }
    } catch(error){
        console.log(error)
        return {succes: false, message: "An unexpected error has occured: "+error.message}
    }
}
/**
 * Deleted a review with a specified id. Verifies if person deleteing is an original poster or a moderator first.
 * @param {object} revToDelete {rev_id: number - id of a review to delete} 
 * @param {string} token - JWT authorization token
 */
async function deleteReview(revToDelete,token){
    let verificationResult = await VerifyUser.verifyToken(token,false)
    let review = await ReviewRepository.getReviewById(revToDelete.rev_id)
    try{
        if(verificationResult.succes){
            var actionPerformer = verificationResult.user
            if(actionPerformer.is_adm || actionPerformer.acc_id===review.acc_id){
                await ReviewRepository.deleteReview(revToDelete.rev_id)
                return {succes: true, message: "The review has been deleted"}
            } else {
                return {succes: false, message: "You do not have permissions to delete this review"}
            }
        } else {
            return verificationResult
        }
    } catch(error){
        console.log(error)
        return {succes: false, message: "An unexpected error has occured: "+error.message}
    }
}

export default {
    getMovieReviews: getMovieReviews,
    addNewReview: addNewReview,
    deleteReview: deleteReview
}