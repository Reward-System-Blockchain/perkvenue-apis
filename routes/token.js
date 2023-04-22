const express = require('express');
const router = express.Router();
const { mintToken } = require("../blockchain/mintToken");



router.get('/',(req,res)=>{
    res.send('We are on tokens');
});


router.post("/mint", async (req, res) => {
   
  
//     try {  
      
//     } catch (err) {
      
//   }
});


module.exports = router;