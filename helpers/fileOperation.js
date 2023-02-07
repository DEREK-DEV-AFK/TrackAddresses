const fs = require('fs');

function writeFile(data){
    let strJson = JSON.stringify(data)
    fs.writeFile('./data/data.json',strJson,(err)=> {
        if(err){
            console.log("ERROR : ",err)
        }else {
            console.log("filed saved succesfully")
        }
    })
}

module.exports={writeFile}