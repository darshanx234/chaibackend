class apiError extends Error{
       // custom error message 
    constructor(
        statusCode , 
        message = "Something went wrong",
        errors = [] , 
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null // explore
        this.message = message
        this.success = false;
        this.errors = errors
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this , this.constructor)
        }
    }
}

export {
    apiError
}