const userModel=require('../Models/userModel')

class userService{

    //Constructor
    constructor(userModel)
    {
   this.userModel=userModel;
    }

    //Takes user data, checks if email exists, if not create a new user and insert into db
async Register(userData)
{
//Check if email exists in database
const {full_name,email,password,phone}=userData;
const existingUser=userModel.findByEmail(email);

//If existing then error.json 
if(existingUser){
    console.error("User is already registered");
}

//Else create new user
const newUser={
full_name,
email,
password,
phone
}

//Enter user into db
const [result]=userModel.create(newUser);

}

}

module.exports=userService;