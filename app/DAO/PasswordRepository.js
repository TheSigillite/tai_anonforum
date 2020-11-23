const sqlite3 = require('sqlite3').verbose();
const { resolve, reject } = require('bluebird');
const Promise = require('bluebird');
const { result } = require('lodash');

function savePassword(newUser,acc_id){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let insertQuery = "INSERT INTO UserPasswd(acc_id,passwd) VALUES("
        +acc_id+",'"+newUser.passwd+"')"
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

function getPassword(acc_id){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let getQuery = "SELECT * FROM UserPasswd WHERE acc_id="+acc_id
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

export default {
    savePassword: savePassword,
    getPassword: getPassword
}