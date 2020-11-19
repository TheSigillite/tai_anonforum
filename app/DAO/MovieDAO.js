
const sqlite3 = require('sqlite3').verbose();
const { resolve, reject } = require('bluebird');
const Promise = require('bluebird');


function getAllMovies() {
    let db = new sqlite3.Database('C:/projects/TAI_anonforum/app/DAO/anonforum.sqlite');
    let query = 'SELECT * FROM Movies'
    console.log(db)
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

async function addMovie(movie) {
    try {
        let db = new sqlite3.Database('./anonforum.sqlite');
        let lastIDquery = 'SELECT MAX(movie_id) AS lastMovieID FROM movies';
        var lastID = await db.query(lastIDquery, [])
        let insertquery = 'INSERT INTO Movies(movie_id,title,cover,director,premiere) ' +
            'VALUES(' + lastID.rows.lastMovieID + ',' + movie.title + ',' + movie.cover + ',' + movie.director + ',' + movie.premiere + ')'

    } catch (err) {
        console.log(err.message)
    }
    
}

getAllMovies().then(result => console.log(result),err => console.log(err))