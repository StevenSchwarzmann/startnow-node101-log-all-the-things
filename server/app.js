const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {

    var user = [
        req.headers['user-agent'].replace(',', ' '),
        (new Date()).toISOString(),
        req.method,
        req.path,
        'HTTP/' + req.httpVersion,
        res.statusCode
    ].join(',');

    // write your logging code here
    fs.appendFile('server/log.csv', '\n' + user, function (error, data) {
        if (error) {
            throw error
        }

        console.log(user);
    });

    next();
});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.status(200).send('ok');
    console.log(req);
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile('server/log.csv', 'utf8', function (error, data) {
        if (error) {
            res.send('Error!');
        }

        //split the lines by commas
        var array = data.split('\n');
        var headers = array[0].split(',');
        var allData = [];
        for (i = 1; i < array.length; i++) {
            var newArray = array[i].split(',')
            var obj = {
                [headers[0]]: newArray[0],
                [headers[1]]: newArray[1],
                [headers[2]]: newArray[2],
                [headers[3]]: newArray[3],
                [headers[4]]: newArray[4],
                [headers[5]]: newArray[5]
            }
            allData.push(obj);
        }
   
        res.json(allData);
     })
});
module.exports = app;
