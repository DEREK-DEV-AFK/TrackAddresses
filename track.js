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

///////////////////-GLOBAL-////////////////////
let resultData = []
let lastaddress= '', depth = 0;
///////////////////////////////////////////////

/**
 * 
 * @param {*} address 
 * @param {*} role 
 * @param {*} minRound 
 * @param {*} maxRound 
 * @param {*} maxAmount 
 * @returns 
 */
async function filterdata(address, role, minRound, maxRound, maxAmount) {
    // default obj
    let data = {
        "address": address,
        "amount-sended": 0,
        "amount-received": 0,
        "fromRound": 0,
        "toRound": 0,
        "receivers-address": []
    }

    //  getting txn of specific address with define role and round
    let txns = await getTransactionOfAsset(address, role, minRound, maxRound)
    // accessing each transaction
    // txns.transactions.forEach((txn,i) => {
    for (let i = txns.transactions.length - 1; i >= 0; i--) {
        let txn = txns.transactions[i]
        // console.log("txn ",txn)
        // checking that we have reached the amount till we want txns
        if (maxAmount && data['amount-sended'] >= maxAmount) {
            // console.log("max amount reached !!!")
            if (!data.toRound) {
                data.toRound = data['receivers-address'][data['receivers-address'].length - 1]['asset-received-at-round']
            }
            return data;
        } else {
            // saving the from round
            if (i == 0) {
                data.toRound = txn['confirmed-round']
            }
            // saving the to round
            if (i == txns.transactions.length - 1) {
                data.fromRound = txn['confirmed-round']
            }
            // should not be opt-in txn
            if (txn['asset-transfer-transaction'].receiver != data.address) {
                // this return if that address axist or not with index if exist
                let checker = check(txn['asset-transfer-transaction'].receiver, data['receivers-address'])

                // console.log("values ", txn['asset-transfer-transaction'].receiver, "other ",data.address)
                // console.log("checker ",checker, "is ",txn['asset-transfer-transaction'].receiver != data.address)

                // checking if address exist 
                if (!checker.exist) {
                    console.log("inside if")
                    let subAddress = {
                        "address": "",
                        "amount-received": 0,
                        "amount-sended": 0,
                        "asset-received-at-round": 0
                    }
                    subAddress.address = txn['asset-transfer-transaction'].receiver
                    subAddress['amount-received'] = txn['asset-transfer-transaction'].amount
                    subAddress['asset-received-at-round'] = txn['confirmed-round']
                    data['receivers-address'].push(subAddress)
                    console.log("pushed ")
                } else { // if exist then just adding up the amount 
                    console.log("else ")
                    let index = checker.index
                    // console.log("index",data['receivers-address'][index])
                    // checking the type so we can create array of amount received
                    // console.log("value ",data['receivers-address'][index]['amount-received']," type ",typeof(data['receivers-address'][index]['amount-received']))
                    // if(typeof(data['receivers-address'][index]['amount-received']) == "number"){
                    //     console.log("type is number")
                    //     let amount = data['receivers-address'][index]['amount-received'];
                    //     data['receivers-address'][index]['amount-received'] = [amount];
                    //     data['receivers-address'][index]['amount-received'].push(txn['asset-transfer-transaction'].amount)

                    //     // pushing the round the amount received at
                    //     let round = data['receivers-address'][index]['asset-received-at-round']
                    //     data['receivers-address'][index]['asset-received-at-round'] = [round]
                    //     data['receivers-address'][index]['asset-received-at-round'].push(txn['confirmed-round'])

                    // }else{// the type is already array, so just pusging the amount
                    //     data['receivers-address'][index]['amount-received'].push(txn['asset-transfer-transaction'].amount) 
                    //     data['receivers-address'][index]['asset-received-at-round'].push(txn['confirmed-round'])
                    // }
                    data['receivers-address'][index]['amount-received'] += txn['asset-transfer-transaction'].amount
                }
            }
            data['amount-sended'] += txn['asset-transfer-transaction'].amount
        }
    }
    // })

    // data['total-amount-sended']= totalAmount;

    // console.log("filter",data)
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


let loopIndex = 0
/**
 * Goal is to create an fucntion which should take address and othe para such as role and min,max round
 * What it should do :
 * 1) if its first which means deepth is zero so we will direcclty store it in the array and increase the depth so we can move on to inner address
 * 2) if not then we will get the depht so we can acess the inner object by depth and save the address data to that address object
 * 3) 
 */
async function tracker(address, role, minRound, maxRound, maxAmount, indexAt, hasReachMaxIndex) {
    console.log("result here ", resultData)
    if (resultData.length == 0) { // which means its an first time 
        // getting the data and pushing it into the array
        let data = await filterdata(address, role, minRound, maxRound, maxAmount);
        resultData.push(data);
        console.log("push", resultData)

        depth++; // incresing the depth so we can move to inner object

        // looping the addresses and calling it
        resultData[0]['receivers-address'].forEach(async (addrObj, i) => {
            if (i == resultData[0]['receivers-address'].length - 1) {
                tracker(addrObj.address, 'sender', resultData[0].fromRound, 0, resultData[0]['amount-sended'], i, true)
            } else {
                tracker(addrObj.address, 'sender', resultData[0].fromRound, 0, resultData[0]['amount-sended'], i, false)
            }
        })
    } if (depth == 1) {
        console.log('in depth 1')
        console.log("data recived", address, minRound, indexAt, hasReachMaxIndex)
        let data = await filterdata(address, role, minRound, maxAmount, maxAmount);
        // console.log("data received ",data)
        resultData[0]['receivers-address'][indexAt]['amount-sended'] = data['amount-sended']
        resultData[0]['receivers-address'][indexAt].fromRound = data.fromRound
        resultData[0]['receivers-address'][indexAt].toRound = data.toRound
        resultData[0]['receivers-address'][indexAt]['receivers-address'] = data["receivers-address"]
        console.log("final data look like", resultData[0]['receivers-address'][indexAt])
        // has reach the last array value
        if (hasReachMaxIndex) {
            let arrayLength = indexAt // storing the max index to loop
            depth++; // increase the depth 
            // looping and calling 
            for (let i = 0; i <= arrayLength; i++) {
                resultData[0]['receivers-address'][i]['receivers-address'].forEach((addrObj, i) => {
                    if (i == resultData[0]['receivers-address'][i]['receivers-address'] - 1) {
                        tracker(addrObj.address, 'sender', resultData[0].fromRound, 0, resultData[0]['amount-sended'], i, true)
                    } else {
                        tracker(addrObj.address, 'sender', resultData[0].fromRound, 0, resultData[0]['amount-sended'], i, false)
                    }
                })
            }

        }
    } else if (depth = 2) {
        console.log("in depth 2")
        console.log("data",address,role,minRound,maxRound,maxAmount)
        let data = await filterdata(address, role, minRound, maxRound, maxAmount)
        if (loopIndex < resultData[0]['receivers-address'].length) {
            console.log("loop index ", loopIndex)
            resultData[0]['receivers-address'][loopIndex]['receivers-address'][indexAt]['amount-sended'] = data["amount-sended"]
            resultData[0]['receivers-address'][loopIndex]['receivers-address'][indexAt].fromRound = data.fromRound
            resultData[0]['receivers-address'][loopIndex]['receivers-address'][indexAt].toRound = data.toRound
            resultData[0]['receivers-address'][loopIndex]['receivers-address'][indexAt]['receivers-address'] = data["receivers-address"]
        }
        loopIndex++;
        if (hasReachMaxIndex) {
            depth++;
        }

    }
    // console.log("final data",resultData)
    // console.log("inner final data",resultData[0])
    // console.log('inner inner data', resultData[0]['receivers-address'][0]['receivers-address'])
    writeFile(resultData,'data.json')
    console.log("depth",depth)
}




/***
 * Logic behind the depth 
 * we will check the depth decide how much deep we have to go in
 * and we need to make things reusable
 */




// function getData(){
//     // need to take address array and max return data 
// }

// filterdata('TCUVIUKA56I6TU2FMTA76DB2I75LZZSDUW3QK3YIRGIJYK2JXO4SYKDNBY','sender',18062467,0);

tracker('636WHO3OAKNXPHOXDFEX5S5LSA35LWMN75JAVDLH4FOACAJSJNVHM47T7Y','sender',0,0,0,0,false)