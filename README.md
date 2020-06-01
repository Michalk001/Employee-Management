# Employee Management
 

## Installation

- Clone repo or use .zip file
- Open backend directory in Command-line
- `npm install` to install 
- `npm run start-dev` to local start 
- Open frondend directory in Command-line
- `npm install` to install 
- `npm run start-dev` to local start 

## Usage

Default addres for frondend `http://localhost:8000/`
Default addres for backend `http://localhost:4006/`

Example frondend addres `https://empfrontend.ew.r.appspot.com/`

User login with administrator rights  
`Login: admin Password: test1234`
`Login: monbrz Password: monbrz1234`
   
User login  without administrator rights  
`Login: jankow Password: jankow1234`


## Configuration

### Backend

Example config.json

``
{
    "PORT": 4006,
    "DBURL": "postgres://wollier:test1234@34.67.90.33:5432/emdb",
    "DBADMIN":{
        "username": "admin",
        "password": "test1234",
        "firstname": "Marek",
        "lastname": "Wojtula",
        "email": "test@test.com"
    }
}
``

- DBURL - PostgresSQL database

### Frondend

Example config.json

```
{
    "apiRoot": "https://empbackend.ew.r.appspot.com/",
    "users": {
        "passwordChar": 8
    }
}
```

- apiRoot - url to backend server

## Other

Database was created for testing. Configuration data to db is in config.json

Backend server was created for testing. `https://empbackend.ew.r.appspot.com/`

Using hosting: Google Cloud Platform

## Technologies

- React
- NodeJS

