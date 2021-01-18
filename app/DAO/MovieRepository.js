
const sqlite3 = require('sqlite3').verbose();
const { resolve, reject } = require('bluebird');
const Promise = require('bluebird');
const { result } = require('lodash');


function getAllMovies() {
    console.log(__dirname)
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let query = 'SELECT * FROM Movies'
    return new Promise((resolve, reject) => {
        db.all(query, [], (error, result) => {
            if (error) {
                console.log('Error running sql: ' + query)
                console.log(error)
                reject(error)
            } else {
                db.close()
                resolve(result)
            }
        })
    })
}

function getMovieByMovieId(movie_id){
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let getQuery = 'SELECT * FROM Movies WHERE movie_id = '+movie_id;
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

function addMovie(movie) {
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let lastIDquery = 'SELECT MAX(movie_id) AS lastMovieID FROM Movies';
    return new Promise((resolve,reject) => {
            var lastID = undefined
            db.get(lastIDquery,(error,result)=>{
                if (error) {
                    console.log('Error running sql: ' + lastIDquery)
                    console.log(error)
                    reject(error)
                } else {
                    lastID = result.lastMovieID+1
                    let insertquery = "INSERT INTO Movies (movie_id,title,cover,director,premiere) " +
                    "VALUES(" + lastID + ",'" + movie.title + "','" + movie.cover + "','" + movie.director + "','" + movie.premiere + "')"
                    db.run(insertquery,(error) => {
                        if (error) {
                            console.log('Error running sql: ' + insertquery)
                            console.log(error)
                            reject(error)
                        } else {
                            db.close()
                            resolve(lastID)
                        }
                    })
                }
            })
        })
}

function deleteMovie(movieID){
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let deleteQuery = 'DELETE FROM Movies WHERE movie_id = '+movieID;
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

function updateMovie(movie){
    let db = new sqlite3.Database(__dirname + '\\anonforum.sqlite');
    let updateQuery = "UPDATE Movies SET title = '"+ movie.title +"', cover = '"+ movie.cover +"', director = '"
        + movie.director +"',premiere = "+ movie.premiere +" WHERE movie_id = "+movie.movie_id
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
    getAllMovies: getAllMovies,
    getMovieByMovieId: getMovieByMovieId,
    addMovie: addMovie,
    deleteMovie: deleteMovie,
    updateMovie: updateMovie
}
