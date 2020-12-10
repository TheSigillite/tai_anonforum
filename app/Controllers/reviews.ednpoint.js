import ReviewsService from '../Service/Reviews.Service'

const reviewsEndpoint = (router) => {
    router.get('/reviews/get/:movie_id',async (request,response,next) => {
        let movie_id = request.params.movie_id
        let reviews = await ReviewsService.getMovieReviews(movie_id)
        response.status(200).send(reviews)
    });

    router.post('/reviews/new', async (request,response,next) => {
        let newReview = request.body
        let token = request.header('x-auth-token')
        let result = await ReviewsService.addNewReview(newReview,token)
        response.status(200).send(result)
    });

    router.delete('/reviews/delete', async (request,response,next) => {
        let toDelete = request.body
        let token = request.header('x-auth-token')
        let result = await ReviewsService.deleteReview(toDelete,token)
        response.status(200).send(result)
    })

}

export default reviewsEndpoint