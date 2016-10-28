/**
 * Created by Andres Carmona Gil on 29/09/2016.
 */
var when = require("when");
//var RED = require("./red/red.js");
var http = require("http");
var users_authenticate={};
var loopback=require('node-sensor-red-loopback');
module.exports = {
    type: "credentials",
    users: function(username) {
        return when.promise(function(resolve) {
            // Do whatever work is needed to check username is a valid
            // user.
            // Resolve with null to indicate this user does not exist
            var session=null
            if (users_authenticate[username]) {
                // Resolve with the user object. It must contain
                // properties 'username' and 'permissions'
                if (users_authenticate[username].session.expired>new Date()){
                     session = users_authenticate[username].permissions
                }else{
                    delete users_authenticate[username]
                }
            }
            resolve(session);
        });
    },
    authenticate: function (username, password) {
        return when.promise(function (resolve) {
            // Do whatever work is needed to validate the username/password
            // combination.

            var postData = JSON.stringify({
                'email': username,
                'password': password
            });
            var options = {
                hostname: 'localhost',
                port: 4000,
                path: '/api/Customers/usersNodeRed',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': Buffer.byteLength(postData),
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip,deflate,sdch',
                    'Accept-Language': 'en-US,en;q=0.8'
                }
            };
            var req = http.request(options, function (res) {
                var userNodeSensor = false;
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    userNodeSensor = JSON.parse(chunk);
                });
                res.on('end', function () {

                    resolve(resolveTypePermission(userNodeSensor))
                });
            });
            req.on('error', function (e) {
                console.log(e)
                console.log("node sensor connect lose!!! connect direct of loopback in node-red")
                // one parameter is null because loopback not init express and not pass context(ctx)
                loopback.models.Customer.usersNodeRed(null,postData,function(err, userNodeSensor){
                    if(err){
                        resolve(null)
                    }else{
                        resolve(resolveTypePermission(userNodeSensor.__data))
                    }

                })

            });
            req.write(postData);
            req.end();
            function resolveTypePermission(userNodeSensor){
                var typepermission = null
                if (userNodeSensor) {
                    if (!userNodeSensor.error) {
                        if(userNodeSensor.roles){
                            if(userNodeSensor.roles.length>0){
                                switch (userNodeSensor.roles[0].name) {
                                    case "admin":
                                        typepermission = {username: userNodeSensor.email, permissions: "*"};
                                        break;
                                    case "operator":
                                        typepermission = {username: userNodeSensor.email, permissions: "read"};
                                        break;
                                    case "root":
                                        typepermission = {username: userNodeSensor.email, permissions: "*"};
                                        break;
                                    default:
                                        typepermission = {username: userNodeSensor.email, permissions: "read"};
                                        break;
                                }

                            }else{
                                typepermission = {username: userNodeSensor.email, permissions: "read"};
                            }
                            typepermission.customerId=userNodeSensor.id;
                            users_authenticate[userNodeSensor.email] = userNodeSensor;
                            users_authenticate[userNodeSensor.email].permissions = typepermission;
                            var now = new Date();
                            users_authenticate[userNodeSensor.email].session = {
                                created: now,
                                ttl: 1000 * 60 * 60 * 20,
                                expired: new Date(now.getTime() + (1000 * 60 * 60 * 20))
                            }
                        }
                    }
                }
                return typepermission
            }
        });

        // delete user with session expired
        for(var property in this.users_authenticate){
            if(this.users_authenticate[property].session.expired<new Date())
                delete this.users_authenticate[property]
        }
    },
    default: function() {
        return when.promise(function(resolve) {
            // Resolve with the user object for the default user.
            // If no default user exists, resolve with null.
           // resolve({anonymous: true, permissions:"read"});
            resolve(null);
        });
    }
}