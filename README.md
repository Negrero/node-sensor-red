# node-sensor-red
## Descripción
Se ha llevado a cabo la adaptación de node-red para ejecutar node-sensor-red-loopback junto con la authentication de node-sensor utilizando una sola coleccion.
Hemos adaptado el archivo ejecutable de node-red red.js ya que este fichero acepta parametros los cuales nosotros no usaremos ya que tenemos el archivo settings.js directamente en el directorio de trabajo. 
El resto del fichero se ha dejado intacto solo se ha comentado las lineas que hace referencia a la carga de argumentos, de esta manera tendremos toda la comprobacion del fichero de settings.js.
## Dependencias
- node-red 0.14.6
- express 4.14.0
- node-sensor-red-loopback 0.0.1
## Arbol de directorios
- editor: es la carpeta con el cliente de node-red.
- public: es la carpeta con el cliente de node-red compilado-minificado y del cual se expone.
## Archivos usados
- red.js: igual que el de node-red(explicado en la descripccion)
- user-authentication.js: es para validar los usuarios contra la api de node-sensor. Tiene tres metodos:
     - users: es para saber si un usuario esta logueado o no.
     - authenticate: para loguearse.
     - default: por defecto el sistema devolvera un false que corresponde a la ventana de logueo
- settings.js: es la configuración de node-red y las contribuciones necesarias para su funcionamiento(no se han quitado del archivo los comentarios para que sirvan de ayuda) resumen del archivo sin comentarios:
```


module.exports = {
    uiPort: process.env.PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    debugMaxLength: 1000,
    httpStatic: './public',
    adminAuth:require("./user-authentication"),
    httpNodeCors: {
        origin: "*",
        methods: "GET,PUT,POST,DELETE"
    },
    httpAdminCors: {
        origin: "*",
        methods: "GET,PUT,POST,DELETE"
    },
    functionGlobalContext: {
        // os:require('os'),
        // octalbonescript:require('octalbonescript'),
        // jfive:require("johnny-five"),
        // j5board:require("johnny-five").Board({repl:false})
    },
    logging: {
        // Only console logging is currently supported
        console: {
            // Level of logging to be recorded. Options are:
            // fatal - only those errors which make the application unusable should be recorded
            // error - record errors which are deemed fatal for a particular request + fatal errors
            // warn - record problems which are non fatal + errors + fatal errors
            // info - record information about the general running of the application + warn + error + fatal errors
            // debug - record information which is more verbose than info + info + warn + error + fatal errors
            // trace - record very detailed logging + debug + info + warn + error + fatal errors
            level: "info",
            // Whether or not to include metric events in the log output
            metrics: false,
            // Whether or not to include audit events in the log output
            audit: false
        }
    },
    storageModule:require('node-red-storage-multiproject'),
    mongodbMultiproject:{
        port:27017,
        host:(process.NODE_ENV==="development")?"localhost":"localhost",
        bd:"nodesensor",
        user:"nodesensor",
        password:"nodesensor"
    }
}
```