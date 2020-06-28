'use strict';

//import express
const express = require('express');
const visitatorDao = require('./visitator_dao');
const userDao = require('./user_dao');
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 300; //seconds
// Authorization error
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };
//create application
const app = express();
const port = 3001;
// Set-up logging
//userDao.GetAvailableCars('20200630','20200717','B').then( result => console.log(result))

app.use(morgan('tiny'));
// Process body content
app.use(express.json());

app.get('/api/user/cars', (req, res) => {

    userDao.GetAllCars()
       .then((cars) => {
           res.json(cars);
       })
       .catch((err) => {
           res.status(500).json({
               errors: [{'msg': err}],
            });
      }); 
});

app.get('/api/user/rentals', (req, res) => {

    userDao.GetAllRentals()
       .then((rent) => {
           res.json(rent);
       })
       .catch((err) => {
           res.status(500).json({
               errors: [{'msg': err}],
            });
      }); 
});

app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getUser(username)
      .then((user) => {

        if(user === undefined) {
            res.status(404).send({
                errors: [{ 'param': 'Server', 'msg': 'Invalid user' }] 
              });
        } else {
            if(!userDao.checkPassword(user, password)){
                res.status(401).send({
                    errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] 
                  });
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.Username }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({username: user.username, password: user.password, numberOfRentals : user.numberOfRentals,age : user.age });
            }
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
  });


//GET /cars
app.get('/api/visitator/cars', (req, res) => {

     visitatorDao.DBGetCars()
        .then((cars) => {
            res.json(cars);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
             });
       }); 
});



app.get('/api/visitator/categories', (req, res) => {

        visitatorDao.DBGetCategories()
        .then((categories) => {
            res.json(categories);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
             });
       });
});


app.get('/api/visitator/brands', (req, res) => {

    visitatorDao.DBGetBrands()
        .then((brands) => {
            res.json(brands);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
             });
       });
});

app.use(cookieParser());

app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});



// For the rest of the code, all APIs require authentication
app.use(
    jwt({
      secret: jwtSecret,
      getToken: req => req.cookies.token
    })
  );

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(403).json(authErrorObj);
    }
  });


app.get('/api/userRental/:username', (req, res) => {
  userDao.getNumOfRentals(req.params.username)
      .then((numOfRentals) => {
          if(!numOfRentals){
              res.json(null);
          } else {
              res.json(numOfRentals);
          }
      })
      .catch((err) => {
          console.log("server")
          res.status(500).json({
              errors: [{'param': 'Server', 'msg': err}],
          });
      });
});


app.get('/api/carForC', (req, res) => {

  userDao.getCarsForC()
      .then((value) => {
          res.json(value);
      })
      .catch((err) => {
          res.status(500).json({
              errors: [{'msg': err}],
           });
     });
});

app.get('/api/allRentalofUser/:username', (req, res) => {

  userDao.getUserRentals(req.params.username)
      .then((value) => {
          res.json(value);
      })
      .catch((err) => {
          res.status(500).json({
              errors: [{'msg': err}],
           });
     });
});

app.delete('/api/userRentalDelete/:idCar/:username/:beginDate/:endDate', (req, res) => {
  userDao.deleteRental(req.params.idCar,req.params.username,req.params.beginDate, req.params.endDate)
  .then((result) => res.status(204).end())
  .catch((err) => {
    res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}],
    }); 
  });
  });
  

  app.get('/api/carSelected/:beginDate/:endDate/:model', (req, res) => {

    userDao.GetIdCar(req.params.beginDate, req.params.endDate, req.params.model)
    .then((cars) => {
      if(!cars){
          res.status(404).send();
      } else {
          res.json(cars);
      }
      })
    .catch((err) => {
      res.status(500).json({
          errors: [{'param': 'Server', 'msg': err}],
      }); 
    });
    });

   
    app.post('/api/userRental/insert', (req,res) => {

      userDao.insertRental(req.body.Username, req.body.IdCar, req.body.BeginDate, req.body.EndDate)
        .then((result) => res.status(204).json({"id":result}))
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
    });

    
app.listen(port, ()=>console.log(`Server running on http://localhost:${port}/`));
