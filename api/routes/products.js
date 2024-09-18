const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth")
const path = require("path");
const fs = require("fs");

const os = require('os');

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}
const localIpAddress = getLocalIpAddress();




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });






const Product = require("../models/product")




router.get("/", (req,res , next)=>{
    Product.find()
    .select("name price _id productImage videos instructor isfav")
    .exec()
    .then( docs=>{

        const response =  docs.map( doc =>{
                return {
                    name: doc.name,
                    instructor: doc.instructor,
                    price: doc.price,
                    productImage : `http://${localIpAddress}:3000/uploads/${path.basename(doc.productImage)}`,
                    _id: doc._id,
                    url: req.body.url,
                    videos : doc.videos,
                    // request:{
                    //     type: "GET",
                    //     url : "http://localhost:3000/product/"+ doc._id
                    // }
                }
            });
    //    if(docs.length >= 0){
        res.status(200).json(response);

    //    }else{
    //     res.status(404).json({
    //         message:"not found"
    //     })
    //    }
     })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        }) 
    }
    )
})
router.post("/", upload.single("productImage"),(req,res , next)=>{

    let videos = [];
    try {
        videos = JSON.parse(req.body.videos);
    } catch (error) {
        return res.status(400).json({
            error: "Invalid JSON format for videos"
        });
    }


    const invalidVideos = videos.filter(video => !video.url);
    if (invalidVideos.length > 0) {
        return res.status(400).json({
            error: "Each video must have a 'url' field"
        });
    }

    // console.log(req.file)
    // const videos = JSON.parse(req.body.videos);
    const product = Product({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    instructor: req.body.instructor,
    price: req.body.price,
    productImage: req.file.path,
    isfav: req.body.isfav,
    videos: videos
  });
   product
   .save()
   .then(result =>{
    console.log(res);
    res.status(201).json({
        message : "Created Object Success",
        createdproduct : {
            name: result.name,
            instructor: result.instructor,
            price : result.price,
            _id: result._id,
            videos: result.videos,
            request:{
                type: "GET",
                url : "http://localhost:3000/product2/"+ result._id
            }
        }
    });
   })
   .catch(err=> {
    console.log(err)
    res.status(500).json({
        error: err
    })
   })
  
});

router.get("/:id", (req,res , next)=>{
    const id = req.params.id
    Product.findById(id)
    .select("name price _id productImage videos instructor")
    .exec()
    .then(doc=> {
        console.log("from database",doc)
        if(doc){
            res.status(200).json({
                product: doc,
                request:{
                    type: "GET",
                    url : "http://localhost:3000/product/"
                }
            });
        }else{
            res.status(404).json({
                message:" no valid entry found"
            })
        }
    })
    .catch(err=> {
        console.log(err)
        res.status(500).json({
            error:err
        })
    });
})


router.get("/name/:name", (req,res , next)=>{
    const name = req.params.name
    Product.findOne({ name: name })
    .select("name price _id productImage videos instructor")
    .exec()
    .then(doc=> {
        console.log("from database" , doc)
        if(doc){
            res.status(200).json({
                product: doc,
                request:{
                    type: "GET",
                    url : "http://localhost:3000/product/" + name
                }
            });
        }else{
            res.status(404).json({
                message:" no valid entry found"
            })
        }
    })
    .catch(err=> {
        console.log(err)
        res.status(500).json({
            error:err
        })
    });
})


router.patch("/:id", (req,res , next)=>{
    const id = req.params.id
    const updateops =  {};
    for(const ops of req.body){
        updateops[ops.propName] = ops.value
    }
    Product.updateOne({_id: id},{ $set: updateops })
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Product Updated",
            request:{
                type: "GET",
                url : "http://localhost:3000/product/" + id
            }
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
    
})

router.delete("/:productid", (req,res , next)=>{
    const id = req.params.productid
    Product.deleteOne({
        _id : id
    })
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Product deleted",
            request:{
                type : "POST",
                url : "http://localhost:3000/product/",
                body :{name: "String" , price: "Number"}
            }
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error :err
        })
    })

})



module.exports = router;