'use strict';

//const Task = require('./task');
const db = require('./db');
const bcrypt = require('bcrypt');
const moment = require('moment');



const createCar = function (row) {
    
    return { Model: row.Model, Category: row.Category, Brand: row.Brand, NumOfCars: row.NumOfCarsAvailable };
}

const createUser = function (row) {

    return { username: row.Username, password: row.Password }
}

const createFullCar = function (row) {

    return  {idCar: row.IdCar, model: row.Model, category: row.Category, brand: row.Brand};

}

const createRental = function (row) {

    return {idCar: row.IdCar ,bd: row.BeginDate, ed: row.EndDate };
}

exports.GetAllCars = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CAR";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cars = rows.map((row) => createFullCar(row))
                resolve(cars);
            }
        });
    });
}

exports.GetAllRentals = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM RENTAL";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let rent = rows.map((row) => createRental(row))
                resolve(rent);            
            }
        });
    });
}

exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM USER WHERE Username = ?"
        db.all(sql, [username], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0){
                console.log("non trova l'user")
                resolve(undefined);
            }
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
  };


exports.GetIdCar= function (startingDay, endDay, model ) {
    return new Promise((resolve, reject) => {
        const sql =`SELECT IdCar 
                        FROM  (SELECT C.IdCar, Model, Category , Brand 
                               FROM RENTAL R, CAR C  
                               WHERE R.IdCar = C.IdCar 
                               AND   (    EndDate < ? OR BeginDate > ? )  
                            
                               UNION  
            
                               SELECT C2.IdCar, Model, Category , Brand 
                               FROM CAR C2 
                               WHERE C2.IdCar NOT IN ( SELECT IdCar FROM RENTAL R2 ) ) AS TABLEFUNCTION
                               WHERE Model = ?`


        db.all( sql, [startingDay, endDay, model], (err, rows) => {

            if(err)
                reject(err);

            else if (rows.lenght === 0) //No Car available
                resolve(undefined);

            else {

                resolve(rows[0].IdCar);

            }
        })

    })


}

exports.getNumOfRentals = function (username) {

    const currentData = moment(new Date()).format('YYYYMMDD')
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS N FROM RENTAL WHERE User = ? AND EndDate < ?"
        db.all(sql, [username,currentData], (err, rows) => {
            if (err) 
                reject(err);
            else{
                resolve(rows[0].N);
            }
        });
    });
  };

  exports.getCarsForC = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) AS N FROM CAR GROUP BY Category ORDER BY Category"
        db.all(sql, [], (err, rows) => {
            if (err) 
                reject(err);
            else{
                resolve({A: rows[0].N, B: rows[1].N, C: rows[2].N, D:rows[3].N, E:rows[4].N});
            }
        });
    });
  };

exports.getUserRentals = function(username) {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM RENTAL WHERE User = ?'
        db.all(sql, [username], (err, rows) => {
            if (err) 
                reject(err);
            else{
                resolve(rows);
            }
        });
    });    

}


exports.insertRental = function (username, idCar, bd , ed){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO RENTAL(IdCar, User, BeginDate, EndDate ) VALUES(?,?,?,?)';
        db.run(sql, [idCar,username, bd, ed], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log(this.lastID);
                resolve(this.lastID);
                //resolve(true);
            }
        });
    });

}

exports.deleteRental = function(idCar,username,bdate,edate) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM RENTAL WHERE IdCar= ? AND User= ? AND BeginDate= ? AND EndDate= ?';
        db.run(sql, [idCar,username,bdate,edate], (err) => {
            if(err)
                reject(err);
            else 
                resolve(true);
        })
    });
}



exports.checkPassword = function(user, password){
    let hash = bcrypt.hashSync(password, 10);
    console.log(hash);

    return bcrypt.compareSync(password, user.password);
}
