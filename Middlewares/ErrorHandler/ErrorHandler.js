const ErrorHandler =(error,request,response,next) => {
    if(error) return response.status(500).send('Unknown Internal Server Error');
    next();
}

module.exports=ErrorHandler;