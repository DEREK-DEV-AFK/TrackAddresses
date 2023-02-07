/**
 * To find that the address exist or not in the array 
 * @param {*} addressToFind 
 * @param {*} dataObj 
 * @returns 
 */
function check(addressToFind, dataObj){
    let index = 0
    let exist =  dataObj.some((ele,i) => {
        if(ele.address === addressToFind){
            index = i
            return true
        }
    })
    return {"exist": exist, "index": index}
}

module.exports={check}