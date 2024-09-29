import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name:{
        type:String,
        requires: true
    },
    email:{
        type:String,
        requires: true
    },
    score:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        requires: true
    }
})

  
  userSchema.methods.isPasswordCorrect = async function (password) {
    return password===this.password;
  };
  

export const User = mongoose.model("User", userSchema);