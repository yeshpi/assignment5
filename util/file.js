const fs=require('fs');
const deleteFile=(fileLocation)=>{
    fs.unlink(fileLocation,err=>{
        if(err){
           throw (err)
        }
    })
}

//module.exports=deleteFile
exports.deleteFile=deleteFile;