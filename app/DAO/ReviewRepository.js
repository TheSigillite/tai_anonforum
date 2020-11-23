const sqlite3 = require('sqlite3').verbose();
const { resolve, reject } = require('bluebird');
const Promise = require('bluebird');
const { result } = require('lodash');

function newReview(newreview,user){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let lastIdQuery = "SELECT MAX(rev_id) as lastRevID FROM Reviews"
    return new Promise((resolve,reject)=>{
        var lastId = 1
        db.get(lastIdQuery,(error,result)=>{
            if (error) {
                console.log('Error running sql: ' + lastIDquery)
                console.log(error)
                reject(error)
            } else {
                if(lastId < result.lastRevID){
                    lastId = result.lastRevID+1
                }
                let insertQuery = "INSERT INTO Reviews(rev_id,movie_id,acc_id,rev) VALUES ("
                    +lastId+","+newreview.movie_id+","+user.acc_id+",'"+newreview.rev+"')"
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
            }
        })
    })
}

function deleteReview(rev_id){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let deleteQuery = "DELETE FROM Reviews WHERE rev_id = "+rev_id;
    return new Promise((resolve,reject)=>{
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

function getMovieReviews(movie_id){
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let getQuery = "SELECT * FROM Reviews WHERE movie_id="+movie_id
    return new Promise((resolve, reject) => {
        db.all(getQuery, [], (error, result) => {
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
    getMovieReviews: getMovieReviews,
    newReview: newReview,
    deleteReview: deleteReview
}