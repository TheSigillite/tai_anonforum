import moviesEndpoint from './movies.endpoint'
import reviewsEndpoint from './reviews.ednpoint'
import userEndpoint from './users.endpoint'

const routes = (router,config) => {
    moviesEndpoint(router),
    userEndpoint(router),
    reviewsEndpoint(router)
}

export default routes