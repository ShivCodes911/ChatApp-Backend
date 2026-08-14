declare global {
    namespace Express{
        interface Request{
            user?:{
                userId:string
            };
        }
    }
} 

export {};

// This file extends Express's built-in Request type.
// We add an optional `user` property  because it is not there as build in 
// so that after our authentication
// middleware verifies the JWT, we can safely attach the authenticated
// user's information to `req.user` and access it in other controllers.