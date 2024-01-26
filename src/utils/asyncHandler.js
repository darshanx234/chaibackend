const asyncHandler = (requestHandler)=>{
    return (req , res ,next) => {
        Promise.resolve(requestHandler(req , res ,next)).catch((err)=> next(err))

    }
}

// in summary, this line of code ensures that any asynchronous operation initiated by requestHandler(req, res, next) is wrapped in a Promise. If the Promise is resolved successfully, nothing happens (because there is no .then() part). If the Promise is rejected (i.e., an error occurs), the error is caught, and next(err) is called to pass control to the next middleware with the error.
export {asyncHandler};



// cost asyncHandler = ()=>{}
// cost asyncHandler = ()=>{()=>{}}
// cost asyncHandler = ()=> async()=>{}


// const asyncHandler = (fn) =>async (req , res , next)=>{
//     try {
//         await fn(req , rs , next)
//     } catch (error) {
//         res.status(err.code || 500 ).json({
//             success : false,
//             message : err.message
//         })
//     }
// }

