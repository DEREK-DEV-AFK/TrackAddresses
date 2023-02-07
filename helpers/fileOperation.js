const fs = require('fs');

/**
 * 
 * @param {*} data data you want to write in file
 * @param {string} fileName file name to save data. It must exist in main directory 
 */
function writeFile(data,fileName){
    let strJson = JSON.stringify(data)
    fs.writeFile(`./data/${fileName}`,strJson,(err)=> {
        if(err){
            console.log("ERROR : ",err)
        }else {
            console.log("filed saved succesfully")
        }
    })
}

module.exports={writeFile}