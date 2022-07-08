const User = require('../model/userModel')
const bcrypt=require('bcrypt')

const register = async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
        return res.json({ msg: "Username already used", status: false }); 
    }
        const emailCheck = await User.findOne({ email });
    if(emailCheck)
        return res.json({ msg: "Email is already used", status: false });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        username,
        password: hashedPassword
    });
    delete user.password;
        return res.json({ user, status: true });
    }
    catch (err) {
        console.log(err)
    }

}

const login = async (req, res, next) => {
   
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username:username });
    if (!user) {
        return res.json({ msg: "Incorrect username or password", status: false }); 
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect username or password", status: false }); 
        }
        
        // console.log(isPasswordValid);
    delete user.password;
        return res.json({ user, status: true });
    }
    catch (err) {
        console.log(err)
    }

}

const setAvatar = async (req, res, next) => {
    
    try {
        const userId = req.params.id;
       
      
        const avatarImage = req.body.image;
       
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        })
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    } catch (err) {
        console.log("error");
        next();
    }
}
const getAllUsers =async (req, res, next) => {

    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email","username","avatarImage","_id",
        ])
        return res.json(users);
    }
    catch (err) {
        console.log("Error in fetching all users");
        next();
    }
    
}

module.exports = { register, login ,setAvatar,getAllUsers}

