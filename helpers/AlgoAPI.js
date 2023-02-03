const algosdk = require('algosdk');
const { ASSET_ID } = require('../config');

//////////////////////////////////////////////////////////////////////
let purestackapi = "https://mainnet-algorand.api.purestake.io/idx2"

const baseServer = purestackapi;
const port = "";

const token = {
        'X-API-key': '2JGwhfPGD03FnmVd9lKzC9oSCexWXM8I8yg1EW9G'
}

const indexerClient = new algosdk.Indexer(token, baseServer, port);
//////////////////////////////////////////////////////////////////////
/**
 * This function return all txn for specific address and role in the transaction
 * @param {string} address only algorand address
 * @param {string} role either 'sender' or 'receiver'
 * @returns transaction with filter value
 */
async function getTransactionOfAssetWithRole(address,role){
    if(address && address.length > 0 && address.length <= 58){
        if(role && (role == 'sender' || role == 'receiver')){
            try {
                let txns = await indexerClient.lookupAssetTransactions(ASSET_ID).address(address).addressRole(role).do();
                return txns
            } catch(error){
                console.log("getTransactionOfAssetWithRole:INDEXER:ERROR ",error)
                throw new Error(error)
            }

        }else {
            throw new Error('Invalid role')
        }
    } else {
        throw new Error('Invalid address')
    }
}

/**
 * 
 * @param {string} address only algorand address
 * @param {string} role either 'sender' or 'receiver'
 * @param {number} maxRound must be valid round
 * @returns transaction with filter value
 */
async function getTransactionOfAssetWithRoleAndMaxRound(address,role,maxRound){
    if(address && address.length > 0 && address.length <= 58){
        if(role && (role == 'sender' || role == 'receiver')){
            if(maxRound){
                try {
                    let txns = await indexerClient.lookupAssetTransactions(ASSET_ID).address(address).addressRole(role).maxRound(maxRound).do();
                    return txns
                } catch(error){
                    console.log("getTransactionOfAssetWithRoleAndMaxRound:INDEXER:ERROR ",error)
                    throw new Error(error)
                }
            }else {
                throw new Error('Invalid max round');
            }    
        } else {
            throw new Error('Invalid role')
        }
    } else {
        throw new Error('Invalid address')
    }   
}

/**
 * 
 * @param {string} address only algorand address
 * @param {string} role either 'sender' or 'receiver'
 * @param {number} minRound must be valid round
 * @returns transaction with filter value
 */
async function getTransactionOfAssetWithRoleAndMinRound(address,role,minRound){
    if(address && address.length > 0 && address.length <= 58){
        if(role && (role == 'sender' || role == 'receiver')){
            if(minRound){
                try {
                    let txns = await indexerClient.lookupAssetTransactions(ASSET_ID).address(address).addressRole(role).minRound(minRound).do();
                    return txns
                } catch(error){
                    console.log("getTransactionOfAssetWithRoleAndMinRound:INDEXER:ERROR ",error)
                    throw new Error(error)
                }
            } else {
                throw new Error('Invalid min round')
            }
        } else {
            throw new Error('Invalid role')
        }
    } else {
        throw new Error('Invalid address')
    }   
}

/**
 * 
 * @param {string} address only algorand address
 * @param {string} role either 'sender' or 'receiver'
 * @param {number} minRound must be valid round
 * @param {number} maxRound 
 * @returns 
 */
async function getTransactionOfAssetWithRoleAndMinRoundAndMaxRound(address,role,minRound,maxRound){
    if(address && address.length > 0 && address.length <= 58){
        if(role && (role == 'sender' || role == 'receiver')){
            if(minRound && maxRound){
                try {
                    let txns = await indexerClient.lookupAssetTransactions(ASSET_ID).address(address).addressRole(role).minRound(minRound).do();
                    return txns
                } catch(error){
                    console.log("getTransactionOfAssetWithRoleAndMinRoundAndMaxRound:INDEXER:ERROR ",error)
                    throw new Error(error)
                }
            } else {
                throw new Error('Invliad min round or max round')
            }
        } else {
            throw new Error('Invalid role')
        }
    } else {
        throw new Error('Invalid address')
    }   
}

/**
 * 
 * @param {string} address 
 * @param {string} role 
 * @param {number} minRound 
 * @param {number} maxRound 
 * @returns txn with filter values
 */
async function getTransactionOfAsset(address,role,minRound,maxRound){
    if(address && address.length > 0 && address.length <= 58){
        if(role && (role == 'sender' || role == 'receiver')){
            if(minRound){
                if(maxRound){
                    try {
                        let txns = await indexerClient.lookupAssetTransactions(ASSET_ID).address(address).addressRole(role).minRound(minRound).maxRound(maxRound).do();
                        return txns
                    } catch(error){
                        console.log("getTransaction:INDEXER:ERROR ",error)
                        throw new Error(error)
                    }
                }else{
                    try {
                        let txns = await indexerClient.lookupAssetTransactions(ASSET_ID).address(address).addressRole(role).minRound(minRound).do()
                        return txns
                    } catch(error){
                        console.log("getTransaction:INDEXER:ERROR ",error)
                        throw new Error(error)
                    }
                }
            } else if(maxRound){
                try {
                    let txns = await indexerClient.lookupAssetTransactions(ASSET_ID).address(address).addressRole(role).maxRound(maxRound).do()
                    return txns
                } catch(error){
                    console.log("getTransaction:INDEXER:ERROR ",error)
                    throw new Error(error)
                }
            } else {
                try {
                    let txns = await indexerClient.lookupAssetTransactions(ASSET_ID).address(address).addressRole(role).do()
                    return txns
                } catch(error){
                    console.log("getTransaction:INDEXER:ERROR ",error)
                    throw new Error(error)
                }
            }
        } else {
            throw new Error('Invalid role')
        }
    } else {
        throw new Error('Invalid address')
    }   
}

module.exports = {getTransactionOfAsset, getTransactionOfAssetWithRole, getTransactionOfAssetWithRoleAndMinRound, getTransactionOfAssetWithRoleAndMaxRound, getTransactionOfAssetWithRoleAndMinRoundAndMaxRound}