require('dotenv').config();
const { connectionn } = require('mongoose');
const mysql = require('mysql2');
const { Client } = require('ssh2');
const sshClient = new Client();
const dbServer = {
    host: process.env.host,
    port: process.env.port_db_server,
    user: process.env.user_db_server,
    password: process.env.password_db_server,
    database: process.env.database_server
}
const tunnelConfig = {
    host: process.env.host_tunnel_config,
    port: process.env.port_tunnel_config,
    username: process.env.username_tunnel_config,
    password: process.env.password_tunnel_config
}
const forwardConfig = {
    srcHost: '127.0.0.1',
    srcPort: 3306,
    dstHost: dbServer.host,
    dstPort: dbServer.port
};
const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
        sshClient.forwardOut(
            forwardConfig.srcHost,
            forwardConfig.srcPort,
            forwardConfig.dstHost,
            forwardConfig.dstPort,
            (err, stream) => {
                if (err) reject(err);
                const updatedDbServer = {
                    ...dbServer,
                    stream
                };
                const connection = mysql.createConnection(updatedDbServer);
                let color = "a"
                connection.connect((error) => {
                    if (error) throw error
                    resolve (connection)
                   /* connection.query("SELECT * FROM customers", function (err, result, fields) {
                        if (err) throw err;
                        console.log(result);
                        resolve(connection)
                        
                    });*/
                
                });
                
 
            });

    }).connect(tunnelConfig);
    
  
 /*   connection.connect((error) => {
        if (error) throw error
        connection.query("SELECT * FROM customers", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });*/
    
}); module.exports = SSHConnection;
