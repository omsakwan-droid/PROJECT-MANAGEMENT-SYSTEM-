import {User} from '../models/user.model.js';
import {ApiResponse} from '../utils/api-response.js';
import {ApiError} from '../utils/api-error.js';
import {asyncHandler} from '../utils/async-handler.js';
import {sendemail,emailverificationmailgencontent} from '../utils/mail.js';




const generateAccessandRefreshTokens=async (userId)=>{
   try{
    const user=await User.findById(userId);
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken,refreshToken};


   }
   catch(error){
    throw new ApiError(500,"something went wrong while generating access and refresh tokens",[]);

   }
}

const registerUser=asyncHandler(async(req,res)=>{
    const {email,username,password,role}= req.body;

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    });

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists",[]);
    }

     const user=await User.create({
        email,
        password,
        username,
        isEmailVerified:false,

    })

    const {unHashedToken,hashedToken,tokenExpiry}=user.generateTemporaryToken();


    user.emailVerificationToken=hashedToken;
   user.emailVerificationExpiry = tokenExpiry;
    await user.save({validateBeforeSave:false});



    await sendemail({
        email:user.email,
        subject:"Email Verification",
      mailgenContent:emailverificationmailgencontent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
      );

      if (!createdUser) {
          throw new ApiError(500, "Something went wrong while registering a user");
        }

        return res
            .status(201)
            .json(
              new ApiResponse(
                200,
                { user: createdUser },
                "User registered successfully and verification email has been sent on your email",
              ),
            );

})

const login=asyncHandler(async(req,res)=>{
  const {email,password}=req.body;
if(!email){
    throw new ApiError(400,"email is required",[]);
}

const user=await User.findOne({email});

if(!user){
  throw new ApiError(400,"user doesn't exist",[]);
}

const isPasswordcorrect=await user.isPasswordcorrect(password);

if(!isPasswordcorrect){
  throw new ApiError(400,"password is incorrect",[]);
}

const {accessToken,refreshToken}=await generateAccessandRefreshTokens(user._id);


const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
      );

  
const options={
  httpOnly:true,
  secure:true
}

return res
.status(200)
.cookie("refreshtoken",refreshToken,options)
.cookie("accesstoken",accessToken,options)
.json( new ApiResponse(
  200,{
    user:loggedinUser ,
    accessToken,
    refreshToken
  },
  "User logged in successfully"
))


})


export{registerUser,login};


