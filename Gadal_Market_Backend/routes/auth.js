const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const verifyToken = require("../verifyToken");
router.post('/auth/manuallyVerifyPhone',multer().none(),async(req,res)=>{
  const {phoneNumber} = req.body
  try {
    const response = await  axios.get(`${process.env.AFRO_URL}?from=e80ad9d8-adf3-463f-80f4-7c4b39f7f164&to=${phoneNumber}&len=4`,{
      headers:{
        'Authorization': 'Bearer ' + process.env.AFRO_TOKEN
      }
    })
    if(response?.data?.acknowledge === 'error'){
      res.status(400).send({message:`Failed to send message to ${phoneNumber}`});
    }
    res.send({
      verificationId:response?.data?.response?.verificationId,
    })
  } catch (error) {
    res.status(400).send({error:'Error Occured'})
  }
})
router.put('/auth/verifyPhone',multer().none(),async(req,res)=>{
  const {verificationId,phoneNumber,code} = req.body
  try {
    const response =  await axios.get(`${process.env.AFRO_VERIFY_URL}?to=${phoneNumber}&vc=${verificationId}&code=${code}`,{
      headers:{
        'Authorization': 'Bearer ' + process.env.AFRO_TOKEN
      }
    })
    if(response?.data?.acknowledge === 'error'){
      return res.status(400).send({message:'Verification Failed Please Check your code again'});
    }
    const updatedUser = await User.findOneAndUpdate({phoneNumber:phoneNumber},{isVerified:true},{new:true})
    return res.send(updatedUser);
  } catch (error) {
    res.send('Something went wrong')
  }
})
router.post('/auth/confirmOtp',multer().none(),async(req,res)=>{
  const {verificationId,phoneNumber,code} = req.body
  try {
    const response =  await axios.get(`${process.env.AFRO_VERIFY_URL}?to=${phoneNumber}&vc=${verificationId}&code=${code}`,{
      headers:{
        'Authorization': 'Bearer ' + process.env.AFRO_TOKEN
      }
    })
    if(response?.data?.acknowledge === 'error'){
      return res.status(400).send({message:'Verification Failed Please Check your code again'});
    }
    return res.send({message:'success'});
  } catch (error) {
    res.send('Something went wrong')
  }
})
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
      axios.get(`${process.env.AFRO_URL}?from=e80ad9d8-adf3-463f-80f4-7c4b39f7f164&to=${phoneNumber}&len=4`,{
        headers:{
          'Authorization': 'Bearer ' + process.env.AFRO_TOKEN
        }
      })
      .then(function (response) {
        // handle success
        res.send({
          message:'user successfully created',
          verificationId:response?.data?.response?.verificationId,
          phoneNumber:response?.data?.response?.to
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error.message);
      })
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
  if (!user.isVerified) return res.status(400).send({message:'Your Phone Number is not verified',reason:'NotVerified'})
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send({message:'Incorrect credentials'});
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("token", token).json({ token: token, id: user._id,email:user.email,phoneNumber:user.phoneNumber});
});
router.put("/auth/resetPassword",async(req,res)=>{
  const {password,phoneNumber} = req.body
  try {
  const user = await User.findOne({phoneNumber})
  if(!user) return res.status(400).send('User not found')
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await User.findOneAndUpdate({_id},{password:hashedPassword},{new:true})
  res.status(200).json({message:'Password reset successful'})
  }
  catch(error){
    res.json({message:error})
  }
})
router.put('/auth/changePassword',verifyToken,async(req,res)=>{
  const {_id} = req.user
  const salt = await bcrypt.genSalt(10);
  const {
          oldPassword,
          newPassword,
  } = req.body
  try {
    const user = await User.findById(_id)
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if(!passwordMatch) {
      return res.status(400).json({ message: 'Invalid old password' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate({_id},{password:hashedPassword},{new:true})
    // console.log(hashedPassword)
    return res.json({message:'Password changed successfully'})
  } catch (error) {
    console.log(error)
    res.status(400).json({message:error})
  }
})
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