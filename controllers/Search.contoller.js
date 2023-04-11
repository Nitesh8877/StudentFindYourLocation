const Student = require("../models/Student.model")
const parseStringAsArray = require("../utils/parseString")

exports.index=async(req,res)=>{
    const {techs,longitude,latitude}=req.body
    const techsArray=parseStringAsArray(techs)
    const maxDistance=10000;
    const students=await Student.find({
        techs:{
            $in:techsArray
        },
        location:{
            $near:{
                $geometry:{
                    type:"Point",
                    coordinates:[longitude,latitude]
                },
                $maxDistance:maxDistance
            }
        }
    })
    return res.json({students})
}