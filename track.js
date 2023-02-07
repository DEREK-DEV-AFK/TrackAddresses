const { getTransactionOfAssetWithRole, getTransactionOfAsset } = require("./helpers/AlgoAPI");
const { writeFile } = require("./helpers/fileOperation");
const { check } = require('./helpers/Checker')
// try {
//     getTransactionOfAsset('M3IAMWFYEIJWLWFIIOEDFOLGIVMEOB3F4I3CA4BIAHJENHUUSX63APOXXM','sender',0,23497850).then((result) => {
//         console.log(result)
//     })
// } catch(error){
//     console.log(error)
// }

// 
let resultData = []
let lastaddress= '', deepth = 0;
//

async function filterdata(address, role, minRound, maxRound,maxAmount){
    // default obj
    let data = {
        "address": address,
        "total-amount-sended": 0,
        "total-amount-sended": 0,
        "fromRound": 0,
        "toRound": 0,
        "receivers-address": []
    }

    //  getting txn of specific address with define role and round
    let txns = await getTransactionOfAsset(address,role,minRound,maxRound)
    // accessing each transaction
    txns.transactions.forEach((txn,i) => {
        // checking that we have reached the amount till we want txns
        if(maxRound && data['total-amount-sended'] >= maxAmount){
            return data;
        }else {
            // saving the from round
            if(i == 0){
                data.toRound = txn['confirmed-round']
            }
            // saving the to round
            if(i == txns.transactions.length -1 ){
                data.fromRound = txn['confirmed-round']
            }
            // this return if that address axist or not with index if exist
            let checker = check(txn['asset-transfer-transaction'].receiver,data['receivers-address'])
            // checking if exist and should not be opt-in txn
            if((!checker.exist) && txn['asset-transfer-transaction'].receiver != data.address){
                let subAddress = {
                    "address": "",
                    "amount-received": 0,
                    "amount-sended": 0
                }
                subAddress.address = txn['asset-transfer-transaction'].receiver
                subAddress['amount-received'] = txn['asset-transfer-transaction'].amount
                data['receivers-address'].push(subAddress)
            } else { // if exist then just adding up the amount 
                let index = checker.index
                console.log("index",data['receivers-address'][index])
                data['receivers-address'][index]['amount-received'] += txn['asset-transfer-transaction'].amount
            }
            data['total-amount-sended'] += txn['asset-transfer-transaction'].amount
        }
    })

    // data['total-amount-sended']= totalAmount;

    console.log("filter",data)
    return data
}


//testing the above function 
// let obj = [
//     {
//         "address": "abc"
//     },
//     {
//         "address": "xyz"
//     },
//     {
//         "address": "mnc"
//     }
// ]

// let data = check("xyz",obj)
// console.log("data",data)

async function OrganiseData(address, role, minRound, maxRound){
    console.log("first",resultData)
    // if its first time, then we directly push data
    if(resultData.length == 0){
        const data = await filterdata(address,role,minRound,maxRound);
        // console.log("data", data)
        resultData.push(data)
        console.log("result")
        resultData[0]['receivers-address'].forEach((addr) => {
            OrganiseData(addr,'sender',0,0,resultData[0]['total-amount-sended'])
        })
        // writeFile(resultData)
        deepth = 1

    }else { // else we need to make find the location of the address we have just found and put all the detials into it.
        if(deepth == 1){
            let index = resultData[0]['receivers-address'].indexOf(address);
            
            let data = await filterdata(address, role, minRound, maxRound,);
            if (index != -1) { // which means it exists, never gonna happen
                resultData[0]['receivers-address'][index] = data
            }
            if(index == resultData[0]['receivers-address'].length - 1){
                deepth = 2
                for(let i = 0 ; i < resultData[0]['receivers-address'].length ; i++){
                    resultData[0]['receivers-address'][i]['receivers-address'].forEach((addr) => {
                        OrganiseData(addr,'sender',)
                    })
                }
            }
        } else if(deepth == 2){
            let index = resultData[0]['receivers-address'].indexOf(address);
        }
        
        console.log("third",resultData);
    }
    console.log("final",resultData)
    writeFile(resultData)
}


function getData(){
    // need to take address array and max return data 
}

filterdata('636WHO3OAKNXPHOXDFEX5S5LSA35LWMN75JAVDLH4FOACAJSJNVHM47T7Y','sender',0,0);

// OrganiseData('636WHO3OAKNXPHOXDFEX5S5LSA35LWMN75JAVDLH4FOACAJSJNVHM47T7Y','sender',0,0)