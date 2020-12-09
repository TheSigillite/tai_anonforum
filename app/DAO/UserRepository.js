const sqlite3 = require('sqlite3').verbose();
const { resolve, reject } = require('bluebird');
const Promise = require('bluebird');
const { result } = require('lodash');

function newUser(newUser){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let lastIdQuery = "SELECT MAX(acc_id) as lastAccID FROM Useraccounts"
    return new Promise((resolve,reject)=>{
        var lastId = 1
        db.get(lastIdQuery,(error,result)=>{
            if (error) {
                console.log('Error running sql: ' + lastIDquery)
                console.log(error)
                reject(error)
            } else {
                if(lastId <= result.lastAccID){
                    lastId = result.lastAccID+1
                    console.log(result.lastAccID)
                    console.log(lastId)
                }
                let insertQuery = "INSERT INTO Useraccounts(acc_id,login,is_adm) VALUES ("
                    +lastId+",'"+newUser.login+"',FALSE)"
                db.run(insertQuery,(error)=>{
                    if (error) {
                        console.log('Error running sql: ' + insertQuery)
                        console.log(error)
                        reject(error)
                    } else {
                        db.close()
                        resolve(lastId)
                    }
                })
            }
        })
    })
}

function getUserByLogin(userLogin){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let getQuery = "SELECT * FROM Useraccounts WHERE login='"+userLogin+"'"
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

function getUserById(acc_id){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let getQuery = "SELECT * FROM Useraccounts WHERE acc_id="+acc_id
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

function makeModerator(acc_id){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let updateQuery = "UPDATE Useraccounts SET is_adm=1 WHERE acc_id="+acc_id
    return new Promise((resolve,reject) => {
        db.run(updateQuery,(error) => {
            if (error) {
                console.log('Error running sql: ' + updateQuery)
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
    newUser: newUser,
    getUserByLogin: getUserByLogin,
    getUserById: getUserById,
    makeModerator: makeModerator
}