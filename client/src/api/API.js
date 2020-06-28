
async function askForCars(){
    let url = '/api/visitator/cars'
    const response = await fetch(url);
    const carJson = await response.json();
    if(response.ok){
        return carJson;
    } else {
        let err = {status: response.status, errObj:carJson};
        throw err;  
    }
}


async function askForBrands(){
    let url = "/api/visitator/brands";
    const response = await fetch(url);
    const brandJson = await response.json();
    if(response.ok){
        
        return brandJson;
    } else {
        let err = {status: response.status, errObj:brandJson};
        throw err; 
    }
}

async function askForCategories(){ 
    let url = "/api/visitator/categories";
    const response = await fetch(url);
    const catJson = await response.json();
    if(response.ok){
        return catJson;
    } else {
        let err = {status: response.status, errObj:catJson};
        throw err;  
    }
}

async function isAuthenticated(){
    let url = "/api/user";
    const response = await fetch(url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}

async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout(username, password) {
    return new Promise((resolve, reject) => {
        fetch('api/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}



async function askForCarforC(){ 
    let url = "/api/carForC";
    const response = await fetch(url);
    const elemJson = await response.json();
    if(response.ok){
        return elemJson;
    } else {
        let err = {status: response.status, errObj:elemJson};
        throw err;  // An object with the error coming from the server
    }
}

async function askForNumOfRentals(username){ 
    let url = "/api/userRental/" + username;
    const response = await fetch(url);
    const numOfRentals = await response.json();
    if(response.ok){
        return numOfRentals;
    } else {
        let err = {status: response.status, errObj:numOfRentals};
        throw err;  // An object with the error coming from the server
    }
}

async function askForUserRentals(username){ 
    let url = '/api/allRentalofUser/' + username;
    const response = await fetch(url);
    const elems = await response.json();
    if(response.ok){
        return elems;
    } else {
        let err = {status: response.status, errObj:elems};
        throw err;  // An object with the error coming from the server
    }
}

async function askForFreeCars(bday, eday, cat){ 

    const response = await fetch("/api/user/rentals");
    const response2 = await fetch("/api/user/cars");

    let finalCars = []
    let rent = await response.json()
    let car = await response2.json()


   rent = rent.filter( r => ( r.bd < bday && bday < r.ed ) || ( r.bd < eday && eday < r.ed)  )  

   for ( let elem of rent )
    car = car.filter( c => c.idCar !== elem.idCar ) 


    for( let e of car ){

    let copy = car.filter( c => c.model === e.model )

    if( finalCars.every( c => c.Model !== e.model) )
        finalCars.push({Model : e.model, Category : e.category, Brand: e.brand, NumOfCars: copy.length })

    }

    finalCars = finalCars.filter( c => c.Category === cat )

    if(response.ok){
        return finalCars;
    } else {
        let err = {status: response.status, errObj:'err'};
        throw err;  // An object with the error coming from the server
    }
}


async function askForIdCar(startingDay, endDay, model){ 


    let url = "/api/carSelected/" + startingDay + "/" + endDay + "/" + model;
    const response = await fetch(url);
    const cars = await response.json();
    if(response.ok){
        return cars;
    } else {
        let err = {status: response.status, errObj:cars};
        throw err;  // An object with the error coming from the server
    }
}

async function deleteRental(idcar,username,startingDay, endDay){ 
    return new Promise((resolve, reject) => {
        fetch("/api/userRentalDelete/" + idcar + "/" + username + "/" + startingDay + "/" + endDay, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


async function makeRental(username, idCar, bdate, edate) {
    return new Promise((resolve, reject) => {
        fetch('/api/userRental/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({Username: username, IdCar: idCar, BeginDate: bdate, EndDate: edate}),
        }).then((response) => {
            if (response.ok) {
                   /* response.then((info) => {resolve(info)} )*/
                        resolve(null)
                    
                
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}





    function verifyPayment(name, creditcard, cvv, date) {

    if( name == null || creditcard == null || cvv == null || date == null)
        return false

    return true;
    }

    


const API = {askForCars,askForBrands,askForCategories,isAuthenticated,userLogin,userLogout, askForNumOfRentals, askForFreeCars, askForCarforC, verifyPayment, askForIdCar, makeRental,askForUserRentals, deleteRental} ;
export default API;