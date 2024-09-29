import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"


export const registerUser = async(req,res)=>{

    const{name, email, password} = req.body;

    if(!name || !email || !password){
        throw new ApiError(400,"Fields missing");
    }
    
    const existedUser = await User.findOne({ email });


    if(existedUser){
        throw new ApiError(400, "User already exists")
    }

    const user = await User.create({
        name,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError(500, "Internal server error in saving data");
      }

    return res
    .status(201)
    .json(new ApiResponse(201, "User successfully created", createdUser));
}

export const loginUser = async(req,res)=>{
    const { email, password} = req.body;
  if (!email) {
    throw new ApiError(400,  "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password" )
 


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {loggedInUser},
        "User logged in successfully"
      )
    );
}