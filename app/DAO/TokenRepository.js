const sqlite3 = require('sqlite3').verbose();
const { resolve, reject } = require('bluebird');
const Promise = require('bluebird');
const { result } = require('lodash');


function saveToken(newToken){
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let insertQuery = "INSERT INTO Tokens(acc_id,create_time,type,value) VALUES("
        +newToken.acc_id+","+newToken.create_time+",'auth','"+newToken.value+"')"
    return new Promise((resolve,reject) => {
        db.run(insertQuery,(error)=>{
            if (error) {
                console.log('Error running sql: ' + insertQuery)
                console.log(error)
                reject(error)
            } else {
                db.close()
                resolve()
            }
        })
    }) 
}

function getTokenByAccId(acc_id){
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let getQuery = "SELECT * FROM Tokens WHERE acc_id="+acc_id
    return new Promise((resolve, reject) => {
        db.get(getQuery, [], (error, result) => {
            if (error) {
                console.log('Error running sql: ' + getQuery)
                console.log(error)
                reject(error)
            } else {
                console.log(result)
                db.close()
                resolve(result)
            }
        })
    })
}

function getTokenByTokenValue(val){
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let getQuery = "SELECT * FROM Tokens WHERE value='"+val+"'"
    return new Promise((resolve, reject) => {
        db.get(getQuery, [], (error, result) => {
            if (error) {
                console.log('Error running sql: ' + getQuery)
                console.log(error)
                reject(error)
            } else {
                console.log(result)
                db.close()
                resolve(result)
            }
        })
    })
}

function deleteToken(val){
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let deleteQuery = "DELETE FROM Tokens WHERE value='"+val+"'";
    return new Promise((resolve,reject) => {
        db.run(deleteQuery,(error)=>{
            if (error) {
                console.log('Error running sql: ' + deleteQuery)
                console.log(error)
                reject(error)
            } else {
                db.close()
                resolve()
            }
        })
    })
}

function deleteAuthTokensByAcc_id(acc_id){
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let deleteQuery = "DELETE FROM Tokens WHERE acc_id="+acc_id+" AND type='auth'";
    return new Promise((resolve,reject) => {
        db.run(deleteQuery,(error)=>{
            if (error) {
                console.log('Error running sql: ' + deleteQuery)
                console.log(error)
                reject(error)
            } else {
                db.close()
                resolve()
            }
        })
    })
}

export default {
    saveToken: saveToken,
    getTokenByAccId: getTokenByAccId,
    getTokenByTokenValue: getTokenByTokenValue,
    deleteToken: deleteToken,
    deleteAuthTokensByAcc_id: deleteAuthTokensByAcc_id
}