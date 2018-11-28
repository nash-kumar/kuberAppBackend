var searchModule = require('../model/model').userModel;

exports.search=(req,res)=>{
    var noMatch = " ";
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        searchModule.find({firstname: regex}, function(err, allCampgrounds){
           if(err){
               res.send(err); 
           } else {
              if(allCampgrounds.length < 1) {
                  res.status(500).send({success:false, message:"user not found"});
              }else res.status(200).send({success:true, message:"user found",allCampgrounds});
           }
        });
    } else {
           searchModule.find({}, function(err, allCampgrounds){
           if(err){
               res.status(404).send({success:false,message:"Cannot find"})
           } else {
            res.status(200).send({success:true,message:"all users", allCampgrounds})
           }
        });
    }
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};