const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
router.post("/auth/signup", multer().none(), async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    city,
    subCity,
    wereda,
    region,
    password,
  } = req.body
    // check if there is already a user registered with the provided email or phone number
    if(email){
        const emailExist = await User.findOne({email});
        if (emailExist) return res.status(400).send("Email alread exists");    
    }
    if(phoneNumber){
        const emailExist = await User.findOne({phoneNumber});
        if (emailExist) return res.status(400).send("Phone Number alread exists");    
    }
  
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    // Create Username
    //Create User
    const user = new User({
      firstName,
      lastName,
      email:email?email:'',
      phoneNumber:phoneNumber?phoneNumber:'',
      password: hashPassword,
      city,
      subCity,
      wereda,
      region,
    });
  
    try {
      await user.save();
      // send verification email or text
    //   sendEmail({
    //     email,
    //     subject:"Email Verification",
    //     userId:savedUser._id,
    //     token:emailVerifyToken,
    //   })
      res.send({message:'user successfully created'});
    } catch (err) {
      res.status(400).send(err);
    }
  });
//   router.post("/registerAdmin", multer().none(), async (req, res) => {
//   const {
//     name,
//     email,
//     password,
//   } = req.body
//     //checking if the email is valid
//     const {valid, reason, validators} = await isEmailValid(email);
//     // if(!valid) return res.status(400).send(`Invalid email ${validators[reason].reason}`)
//     //Checking user
//     const emailExist = await User.findOne({email});
//     if (emailExist) return res.status(400).send("Email alread exist");
  
//     //Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);
//     // Create Username
//     const username = generateFromEmail(email, 3);
//     //Create User
//     const user = new User({
//       name: name,
//       email:email,
//       username: username,
//       password: hashPassword,
//       accessLevel:1,
//       isAdmin:true,
//     });
  
//     try {
//       const savedUser = await user.save();
//       console.log({savedUser});
//       // res.send({ _id: user._id });
//       res.send({accessLevel:user.accessLevel});
//     } catch (err) {
//       res.status(400).send(err);
//     }
//   });
// router.get('/verifyFromLogin/:email',multer().none(),async(req,res)=>{
//   const {email} = req.params
//   const user = await User.findOne({email})
//   if(!user) return res.status(400).send("user not found")
//   await sendEmail({
//     email,
//     subject:"Email Verification",
//     userId:user._id,
//     token:emailVerifyToken,
//     template:'email'
//   })
//  res.json(user.isActive)
// })
// router.get('/verify/:userId/:token',multer().none(),async(req,res)=>{
// try{
//   const {userId,token} = req.params
//   const emailVerifyed = token === emailVerifyToken
//   if(!emailVerifyed) return  res.send("Email verification failed, possibly the link is invalid or expired");
//   await User.findOneAndUpdate({_id:userId},{isVerifyed:true},{new:true})
//   res.redirect('https://gadal-rent-fronend.vercel.app/verifyed')
//   res.send('verifyed')
// }
// catch(err){

// }

// })
// router.put('/manuallyVerify/:id',multer().none(),async(req,res)=>{
//     const {id} = req.params
//     const verifyedUser = await User.findOneAndUpdate({_id:id},{isVerifyed:true},{new:true})
//     res.json(verifyedUser)
// })

router.post("/auth/signin", multer().none(), async (req, res) => {
  const {emailOrPhone,password}= req.body
  const user = await User.findOne({
    $or : [
        {email:emailOrPhone},
        {phoneNumber:emailOrPhone,}
    ]
  });
  if (!user) return res.status(400).send({message:'User Not found'})
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send({message:'Incorrect credentials'});

  // check the verification
//   if(!user.isVerifyed) return res.status(400).send({
//     errorCode:'ENV',
//     text:"You're not verifyed"
//   });
  //Create Token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("token", token).json({ token: token, id: user._id,email:user.email,phoneNumber:user.phoneNumber});
});
// router.post("/forgotPassword",multer().none(),async(req,res)=>{
//   const {email} = req.body
//   try {
//   const user = await User.findOne({email})
//   if(!user) return res.status(400).send('User not found')
//   let existingToken = await Token.find({userId:user._id})
//   //if there are existing tokens for that user delete them
//   if(existingToken) await Token.deleteMany({userId:user._id})
//   let resetToken = crypto.randomBytes(32).toString("hex");
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(resetToken, salt)
//   const newToken = await new Token({
//     userId: user._id,
//     token:hash,
//     createdAt: Date.now(),
//   }).save();
//   await sendEmail({
//     email,
//     subject:"Password Reset",
//     userId:user._id,
//     token:resetToken,
//     template:'resetpassword'
//   })
//   return res.json(newToken)
//   }
//   catch(error){
//     res.json({message:error})
//   }
// })
// router.patch('/resetPassword',multer().none(),async(req,res)=>{
//   const salt = await bcrypt.genSalt(10);
//   const {
//           newPassord,
//           token,
//           userId,
//   } = req.body
//   try {
//     const passwordResetToken = await Token.findOne({userId})
//     if(!passwordResetToken) return res.status(400).send('Expired Token')
//     const isValid = await bcrypt.compare(token, passwordResetToken.token);
//     if(!isValid) return res.status(400).send('Invalid Token')
//     const hashedPassword = await bcrypt.hash(newPassord, salt);
//     const passChangedUser = await User.findOneAndUpdate({_id:userId},{password:hashedPassword},{new:true})
//     // console.log(hashedPassword)
//     return res.json(passChangedUser)
//   } catch (error) {
//     res.status(400).send({message:error})
//   }
// })
// router.post("/admin/login", multer().none(), async (req, res) => {
//   const {email,password} = req.body
//   //Checking user
//     const user = await User.findOne({
//         $or: [
//           { email: email},
//           { username:email},
//         ],
//       });
//       if (!user) return res.status(400).send("User not found");
//       const validPass = await bcrypt.compare(password, user.password);
//       console.log(validPass)
//       if (!validPass) return res.status(400).send("Incorrect Credential");
    
//       //Create Token
//       const token = jwt.sign({ _id: user._id }, "adlknginvpwqlkjr");
//       res.header("token", token).json({ token: token, id: user._id,level:user.accessLevel,username:user.username});
// });
// router.patch("/admin/updatePassword", multer().none(), verify, async (req, res) => {
//     try {
//       const {username,newPassword,oldPassword} = req.body;
//       const user = await User.findOne({
//         $or: [
//           { username:username, isAdmin: true },
//         ],
//       });
//       const validPass = await bcrypt.compare(oldPassword, user.password);
//       if (!validPass) return res.status(400).send("Incorrect Credential");
//       const salt = await bcrypt.genSalt(10);
//       const hashPassword = await bcrypt.hash(newPassword,salt);
//       const updatedUser = await User.findOneAndUpdate({username:username},{password:hashPassword},{new:true})
//       res.json(updatedUser);
//     } 
//     catch (err) {
//       res.send({message:err});
//     }
//   });
// router.get('/:email',async(req,res)=>{
//   const {email}= req.params
//   try{
// const user = await User.findByEmail(email)
// res.json(user)
//   }
//   catch(err){
//     console.log(err)
//   }
// })

module.exports = router;