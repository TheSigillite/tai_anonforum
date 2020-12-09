
import MoviesService from '../Service/Movies.Service'

const moviesEndpoint = (router) => {
    router.get('/movies/all', async (request,response,next) => {
        let result = await MoviesService.getAllMovies();
        console.log(result)
        response.status(200).send(result)
    })

    router.get('/movies/get/:movie_id', async (request,response,next) => {
        let movie_id = request.params.movie_id
        let result = await MoviesService.getMovie(movie_id)
        response.status(200).send(result)
    })

    router.post('/movies/new', async (request,response,next) => {
        let result = await MoviesService.addMovie(request.body,request.header('x-auth-token'))
        console.log(result)
        if(result.succes){
            response.status(200).send(result)
        } else {
            response.status(401).send(result)
        }
    })

    router.put('/movies/update', async (request,response,next) => {
        let result = await MoviesService.updatedMovie(request.body,request.header('x-auth-token'))
        if(result.succes){
            response.status(200).send(result)
        } else {
            response.status(401).send(result)
        }
    })

    router.delete('/movies/delete', async (request,response,next) => {
        let result = await MoviesService.deleteMovie(request.body,request.header('x-auth-token'))
        if(result.succes){
            response.status(200).send(result)
        } else {
            response.status(401).send(result)
        }
    })
}

export default moviesEndpoint