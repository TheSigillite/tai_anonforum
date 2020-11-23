import moviesEndpoint from './movies.endpoint'
import userEndpoint from './users.endpoint'

const routes = (router,config) => {
    moviesEndpoint(router),
    userEndpoint(router)
}

export default routes