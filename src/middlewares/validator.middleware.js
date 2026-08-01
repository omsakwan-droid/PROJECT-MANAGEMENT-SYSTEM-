import {validationResult} from 'express-validator';
import {ApiError} from '../utils/api-error.js';

export const Validate=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    const extractedErrors=[];

    errors.array().map((err)=>{
        extractedErrors.push({
            [err.param]:err.msg});

    });
     
    throw new ApiError(422,"received data is not valid",extractedErrors);

}
