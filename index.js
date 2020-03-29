'use strict';

const Hapi = require('hapi');
const pg = require('pg');
const rout = require('./routes.js');

const init = async () => {

      const config = {
        host: 'rogue.db.elephantsql.com',
        user: 'koqlosfo',     
        password: 'yI5RFNscREAHZKC2s0NdHoS9dJEm26eR',
        database: 'koqlosfo',
        port: 5432,
        ssl: true
    };
    
    const client = new pg.Client(config);
    client.connect(err => {
        if (err) throw err;
        else {
            
        }
    });

//----------SERVER START

    const server = new Hapi.Server({  
        host: 'localhost',
        port: 3000
      });
      server.start();
      console.log(`Server running at ${server.info.uri}`);
      server.route({  
        method: 'GET',
        path: '/usun',
        handler: (request, reply) => {
            queryDatabase();
            const cmd = client.query('DELETE FROM uzytkownik');
    
            return (cmd);
        }
    });

    //-------------ROUTES

    server.route({
        method: "POST",
        path:'/registration/',
        handler: postUsers
    });

    server.route({
        method: "POST",
        path: '/registration',
        handler: postUsers
        });

    async function postUsersToDB(request, reply){
        try{
            await client.query(`INSERT INTO users (ID, FirstName, LastName, Login, Password) VALUES (DEFAULT, '${request.query.FirstName}', '${request.query.LastName}', '${request.query.Login}', '${request.query.Haslo}')`);
        return true;    
        }
        catch(err){
            console.log(err);
            return false;    
        }
    }

    async function postUsers(request, reply) {
            let success = await postUsersToDB(request, reply);
        if(success){
            return reply.response("Ok").code(201);
        }
        else{
            return reply.response("Error").code(500);
        }
            
    }

    server.route({
        method: "GET",
        path: '/showRegistered',

        handler: getUsers
        });

    async function getUsersFromDB(req, res){
        let response = await  client.query('SELECT ID, FirstName, LastName FROM users');
        return response;
    }

    async function getUsers(request, reply) {
        let users = await getUsersFromDB(request, reply);
        return reply.response(users.rows).code(201);
    }
}

init();
module.exports = init;
