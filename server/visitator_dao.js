'use strict';

const db = require('./db');

const createCar = function (row) {
    
    return { Model: row.Model, Category: row.Category, Brand: row.Brand };
}


exports.DBGetCars = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT Model,Category,Brand FROM CAR";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cars = rows.map((row) => createCar(row));
                resolve(cars);
            }
        });
    });
}

exports.DBGetCategories = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT Category FROM CAR ORDER BY Category";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let cats = rows.map( (row) => row.Category);
                resolve(cats);
            }
        });
    });
}

exports.DBGetBrands = function() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT Brand FROM CAR ORDER BY Brand";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let brands = rows.map( (row) => row.Brand);
                resolve(brands);
            }
        });
    });
}