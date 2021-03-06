
import UsersService from '../Service/Users.Service'


const userEndpoint = (router) => {
    router.post('/users/register',async (request,response,next) =>{
        let result = await UsersService.registerUser(request.body)
            response.status(200).send(result)
    });

    router.post('/users/login',async (request,response,next) => {
        let result = await UsersService.loginUser(request.body)
        response.status(200).send(result)
    })

    router.delete('/users/logout',async (request,response,next) => {
        let token = request.header('x-auth-token')
        let result = await UsersService.logoutUser(token)
        response.status(200).send(result)
    })

    router.post('/users/makemod', async (request,response,next) => {
        let token = request.header('x-auth-token')
        let result = await UsersService.makeMod(request.body,token)
        response.status(200).send(result)
    })
}

export default userEndpoint
//result = {succes:true, message: "Registration succesfull. You will be redirected to login"}
//result = {succes: false, message: "This login is already taken"}
//    "login": "TestUser",
//    "passwd": "f9c57e84c62be16e069c4272eebc40e24f9133f0" - SHA1 for TestPass
//TestUser2
//TestPass2 584cef0e7e263cd91774da397c35d9696496bd40