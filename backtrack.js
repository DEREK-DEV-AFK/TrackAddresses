const { getTransactionOfAssetWithRole, getTransactionOfAsset } = require("./helpers/AlgoAPI");
const { writeFile } = require("./helpers/fileOperation");
const { check } = require('./helpers/Checker')

const whiteListUserAndPool = require('./data/whitelistUser.json');



/**
 * What we need to develop
 * - Create an function to take address or txn hash
 * - Checks an valid address or txn hash
 * - get all the parent addresses 
 * - check if parents addresses are whitlist address, if found then return the addresses or else move forward
 * - if not found then, checks the parents address of the current parent addresses
 * - store the data  in file then for
 */

/**
 * - main function were we will call all the sub function
 * - function to check whitelist users and pools
 * - looping function
 * - function to write data in a file
 * - counting deep we are going in 
 */

/**
 * Funtion is the main function where all the logic meets of backtracking
 * @param {string} address 
 * @param {number} fromRound 
 * @param {number} toRound
 */
async function main(address, fromRound, toRound){
    let role = "receiver"
    // get transaction 
    let txns = await getTransactionOfAsset(address, role, fromRound, toRound);
    writeFile(txns,'txns.json')
    console.log("txns  ", txns.transactions.length)
    let result = filterAndReturnSendersFromOldToNew(txns.transactions)
    console.log("sender addresses ", result.length)
    writeFile(result,'address.json')

    let user = loopAndCheckAddress(result)
    console.log("is white list", user)
    // 
    writeFile(user, 'result.json')

}

/**
 * Funtion to filter all the dublicate address
 * @param {array} transactionArray 
 * @returns returns array of sender addresses
 */
function filterAndReturnSendersFromOldToNew(transactionArray){
    let result = [], pushCount = 0
    for(let i = transactionArray.length - 1; i >= 0; i--){
        if(transactionArray[i]['tx-type'] == 'axfer'){ // if asset transfer txn

            // console.log("asset transfer txn")
            
            let isOptIn = optinChecker(transactionArray[i])
            if(!isOptIn){  // if not an optin txn
                if(pushCount == 0){ // its an first time
                    result.push(transactionArray[i].sender)
                    pushCount++;
                }else {
                    if(result.indexOf(transactionArray[i].sender) == -1){ // checking if exist
                        result.push(transactionArray[i].sender)
                        pushCount++;
                    }
                }
            }
        }else if(transactionArray[i]['tx-type'] == 'appl'){ // if application call txn

            // console.log("app call txn")
            
            let address = getAppCallAddresses(transactionArray[i])

            console.log("appl ", address)
            if(result.indexOf(address) == -1){ // checking if exist 
                result.push(address)
                pushCount++
            }
        }
    }
    return result
}

/**
 * Function filter returns the pool address if any 
 * @param {object} txnObj 
 * @returns 
 */
function getAppCallAddresses(txnObj){
    if(txnObj['inner-txns']){
        for(let i = 0; i < txnObj['inner-txns'].length ; i++){
            if(txnObj.sender == txnObj['inner-txns'][i]['asset-transfer-transaction'].receiver){ // if the sender is receiving token 
                return txnObj['inner-txns'][i].sender // returning the sender 
            }
        }
    } else {
        return ""
    }
}

/**
 * To check address is whitelist user or not
 * @param {string} address 
 * @returns object which boolean and data, if it has founded whitelist user
 */
function checkWhiteListUserOrPool(address){
    let data =  {hasFound: false, data: ""}
    whiteListUserAndPool.forEach((wUser) => {
        if(wUser.address == address){
            data = {hasFound: true, data: wUser}
        }
    })
    return data
}

/**
 * Function loop throught the array and check the whitelist user and pools address
 * @param {array} arrayOfAddresses 
 * @returns empty object if not found or whitelist user infos
 */
function loopAndCheckAddress(arrayOfAddresses){
    let finalResult = [];
    console.log("first",finalResult.length)
    for(let i = 0 ; i < arrayOfAddresses.length ; i++){
        let data = checkWhiteListUserOrPool(arrayOfAddresses[i])
        console.log("data : ", i, " ", data)
        if(data.hasFound){
            finalResult.push(data.data) 
            console.log("second",finalResult.length)
        }
    }
    console.log("third",finalResult.length)
    return finalResult
}

/**
 * Function to check transaction object is optin transaction or not
 * @param {object} txn 
 * @returns returns bool values if the txn is optin or not
 */
function optinChecker(txn){
    if(txn['tx-type'] == 'axfer'){
        if(txn.sender == txn['asset-transfer-transaction'].receiver){
            return true
        }
    }else {
        return false
    }
}

// let data = ["4IBBUATFUAQC53XN5YSDQLCOAS77IBX24WBFJU7S6ZHL65PAFDMACGKN6A","MG3KKJN3DPZH3XT4ENU5CXDSD6I6TW4EHF5RYYBVNFWZFLG3XC7F26LW5Y","2S7EL67TGRY2ROR3LHRVWUJE6N5KRNZ6A7KH73K2GATMNJY5SWZR53BOWA","CTKYOY6WQAKGYVOWPT4NOHJGN2I7T47HXFS4YX727B4N3FP3OIFWOIAFOM"]
// let result =  loopAndCheckAddress(data)
// console.log(result)
// let data = checkWhiteListUserOrPool("MG3KKJN3DPZH3XT4ENU5CXDSD6I6TW4EHF5RYYBVNFWZFLG3XC7F26LW5Y")
// console.log(data)

// main("MG3KKJN3DPZH3XT4ENU5CXDSD6I6TW4EHF5RYYBVNFWZFLG3XC7F26LW5Y", 0 , 0)
main("7INXNJA7X77OLCXJBL7EUAYLKDXUC474R3U4T2QPZGKKVNJPNC4OKKSSXU", 0 , 0)
   