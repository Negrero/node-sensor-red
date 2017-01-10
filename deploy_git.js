/**
 * Created by negrero on 07/12/2016.
 */
const exec = require('child_process',{cwd:__dirname}).execSync;

var url_rockrail="169.44.115.197:8701" //ferrovial
var url_nodesensor="169.44.119.14" // node-sensor
var urlvaldepeace="rockandrail.valdepeace.com:8701"
url=url_rockrail
var command=[
    "slc ctl -C http://"+url+" stop node-sensor-red",
    "slc ctl -C http://"+url+" remove node-sensor-red",
    "slc build",
    "slc ctl -C http://"+url+" create node-sensor-red",
    "slc ctl -C http://"+url+" env-set node-sensor-red NODE_ENV=production",
    "slc ctl -C http://"+url+" env-set node-sensor-red PORT=3005",
    "slc ctl -C http://"+url+" set-size node-sensor-red 1",
    "slc deploy -s node-sensor-red http://"+url]

command.forEach(function(e){
    console.log("execute: "+e)
    try{
        console.log(exec(e).toString())
    }catch(ex){
        //process.exit(1)
        //console.log(ex)
    }
})
console.log("finish")
/*
function each_async(element,cb){
    exec(element, (e, stdout, stderr)=> {
        if (e instanceof Error) {
            console.error(e);
            throw e;
        }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
});

}
*/
