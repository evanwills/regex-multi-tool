var express = require('express');
var app = express();
var port = '56017';
app.use(express.static(__dirname));
app.listen(port);
console.log('rf hex now running on http://localhost:' + port );
