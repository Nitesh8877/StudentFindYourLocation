const Student = require("../models/Student.model")
const websocket = require("../websocket")
const parseStringAsArray = require("../utils/parseString")

exports.storeStudent=async(req,res)=>{
    let studentObj={
        github_username:req.body.github_username,
        techs:req.body.techs,
        longitude:req.body.longitude,
        latitude:req.body.latitude
    }
    console.log(studentObj)
    let github_username=studentObj.github_username;
    let latitude=studentObj.latitude;
    let longitude=studentObj.longitude
    let student=await Student.findOne({github_username})
    if(student){
        return res.status(200).send({
            message:"GitHub Username is alerady exist..."
        })
    }
    if(!student){
        const techsArray=parseStringAsArray(studentObj.techs)
        const location={
            type:"Point",
            coordinates:[studentObj.longitude,studentObj.latitude]
        }
        student=await Student.create({
            github_username,
            techs:techsArray,
            location
        })

        const sendTo=websocket.findConnections(
            {latitude,longitude}, techsArray
        )
        if(sendTo.length>0){
            websocket.sendMessage(sendTo,'new-student',student)
        }
     res.status(200).send({
            message:"Student added successfully! ",
            data:student
        })
    }
    try { 
    } catch (error) {
        res.status(500).send({
            message:"Something went wrong",
        })
    }
}

exports.update=async(req,res)=>{
    const {github_username, techs,longitude,latitude}=req.body;
    try {
    let student=await Student.findOne({github_username})
        if(!student){
            return res.status(400).send({
                message:"GitHub Username is not found!.."
            })
        }
        if(student){
            const techsArray=parseStringAsArray(techs);
            const location={
                type:"Point",
                coordinates:[longitude,latitude]
            }
            student.techs=techsArray
            student.location=location
            await student.save();
        }
        return res.status(200).send({
            message:"Student update successfully",
            data:student
        })

    } catch (error) {
        res.status(500).send({
            message:"Something went wrong"
        })
    }

}

exports.index=async(req,res)=>{
    try {
        let students=await Student.find();
        if(!students){
            return res.status(402).send({
                message:"Student is not available!"
            })
        }
        return res.status(200).send({
            message:"Student data fetch successfully",
            data:students
        })

    } catch (error) {
        res.status(500).send({
            message:"Something went wrong"
        })
    }
}

exports.destroy=async(req,res)=>{
    const github_username=req.body.github_username;
    try {
        let student=await Student.findOneAndDelete({github_username:github_username})
        if(!student){
            return res.status(404).send({
                message:"GitHub Username is not found please enter valid Username....."
            })
        }
        res.status(200).send({
            message:"Student deleted successfully",
            data:student
        })
        
    } catch (error) {
        res.status(500).send({
            message:"Something went wrong...."
        })
    }
}