var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = required('express-session');

var config={
    user:'thinakarankalathi',
    database:'thinakarankalathi',
    host:'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
}

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'someRandomSecretValue',
    cookie : {maxAge : 1000*60*60*24*30}
}))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


function hash(input, salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return hashed.toString('hex');
}

app.get('/hash/:input', function(req, res){
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString)
    
});

app.get('/create-user', function(req, res){
    
    var username = req.body.username;
    var password = req.body.password;
    
    var salt = crypto.getRandomBytes(128).toString('hex');
    var dbstring = hash(password, salt);
    pool.query('INSERT INTO "usr"(username, password) VALUES($1, $2)', [username, dbString] , function(err, result){
        if (err){
            res.status(500).send(err.toString());
        }
        else{
            res.send('User successfully created' + username)
        }
    });
});


//req.session.auth = {userId: result.rows[0].id};


app.get('/article-one', function (req, res) {
  res.send("article-one");
});

var counter = 0;
app.get('/counter', function(req, res){
    counter = counter + 1;
    res.send(counter.toString())
})


var pool = new Pool(config);
app.get('/test-db', function(req, res){
    pool.query('SELECT * FROM test', function(err, result){
        if (err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result))
        }
    });
    
    
});

app.get('/article-two', function (req, res) {
  res.send("article-two");
});

app.get('/article-three', function (req, res) {
  res.send("article-three");
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
