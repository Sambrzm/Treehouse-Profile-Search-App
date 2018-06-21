var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");

//Handle HTTP route GET / and POST / i.e. Home
function home(req, res) {
    //if url == "/" && GET
    if (req.url === "/") {
        if (req.method.toUpperCase() === "GET") {
            //show search
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            renderer.view('header', {}, res);
            renderer.view('Search', {}, res);
            renderer.view('Footer', {}, res);
            res.end();
        } else {
            //if url == "/" && POST
            //get the post data from body
            req.on('data', function(postBody){
                console.log(postBody.toString());  
                //extract the username
                var query = querystring.parse(postBody.toString());
                //remove any spacing             
                username = query.username.replace(/\s/g, ''); 
                //redirect to /:username
                res.writeHead(303, {"Location": "/" + username});
                res.end();                
            })
        }
    }
    
}
//

//Handle HTTP route GET /:username i.e. /chalkers
function user(req, res) {
    //if url == "/...."
    var username = req.url.replace('/', '');    
    if (username.length > 0) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        renderer.view('Header', {}, res);        

        // get JSON from treehouse
        var studentProfile = new Profile(username);
        //on "end"
        studentProfile.on("end", function (profileJSON) {
            //show profile

            //store the values which we need
            var values = {
                avatarUrl: profileJSON.gravatar_url,
                username: profileJSON.profile_name,
                badges: profileJSON.badges.length,
                javascriptPoints: profileJSON.points.JavaScript
            }
            //simple response
            res.write(values.username + ' has ' + values.badges + ' badges\n', function () {
                renderer.view('profile', values, res);
                renderer.view('footer', {}, res);
                res.end();
            });

        });

        //on "error"
        studentProfile.on("error", function (error) {
            renderer.view('error', {
                errorMessage: error.message
            }, res);
            renderer.view('Search', {}, res);
            renderer.view('footer', {}, res);
            res.end();
        });

    }
}
//

//Export
module.exports.home = home;
module.exports.user = user;
//