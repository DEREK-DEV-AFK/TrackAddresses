const { getTransactionOfAssetWithRole, getTransactionOfAsset } = require("./helpers/AlgoAPI");
// try {
//     getTransactionOfAsset('M3IAMWFYEIJWLWFIIOEDFOLGIVMEOB3F4I3CA4BIAHJENHUUSX63APOXXM','sender',0,23497850).then((result) => {
//         console.log(result)
//     })
// } catch(error){
//     console.log(error)
// }


let resultData = []

async function filterdata(address, role, minRound, maxRound){
    let data = {
        "address": address,
        "total-amount-sended": 0,
        "fromRound": 0,
        "toRound": 0,
        "receivers-address": []
    }
    let txns = await getTransactionOfAsset(address,role,minRound,maxRound)
    let totalAmount = 0
    txns.transactions.forEach((txn,i) => {
        if(i == 0){
            data.toRound = txn['confirmed-round']
        }
        if(i == txns.transactions.length -1 ){
            data.fromRound = txn['confirmed-round']
        }
        if((!data['receivers-address'].includes(txn['asset-transfer-transaction'].receiver) && txn['asset-transfer-transaction'].receiver != data.address)){
            data['receivers-address'].push(txn['asset-transfer-transaction'].receiver)
        }
        totalAmount += txn['asset-transfer-transaction'].amount
    })

    data['total-amount-sended']= totalAmount;

    console.log(data)
    return data
}


async function OrganiseData(){

    filterdata('636WHO3OAKNXPHOXDFEX5S5LSA35LWMN75JAVDLH4FOACAJSJNVHM47T7Y','sender',0,0)
}
