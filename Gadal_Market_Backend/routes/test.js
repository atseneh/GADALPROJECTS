const router = require('express').Router()
router.get('/test',(req,res)=>(
    res.send('test get route')
))
router.post('/test',(req,res)=>(
    res.send('test post route')
))
module.exports = router