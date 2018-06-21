var fs = require('fs');

function mergeValues(values, content){
    //cycle over the keys
    for(var key in values){
        //replace all {{key}} with the value from the values object
        content = content.replace("{{" + key + "}}", values[key]);
    }
    //return merged content
    return content;
}

function view(templateName, values, res){
    //read from the template files
    var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: "utf8"});
    //insert values into the content
    fileContents = mergeValues(values, fileContents);
    //write out the contents to the response
    res.write(fileContents); 
    
}

module.exports.view = view;