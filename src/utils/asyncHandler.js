const asyncHandler = (requestHandler)=>{
    (req , res ,next) => {
        Promise.resolve(requestHandler(req , res ,next)).catch((err)=> next(err))

    }
}
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

