var restify = require('restify');
var assert = require('assert');

//
// function respond(req, res, next) {
//   res.send(200, { 'name' : req.params.name});
//   next();
// }

//GET function
function getProduct(req, res, next) {
  var myKey = req.params.apikey;
  console.log('apikey: ' + myKey);

  if (myKey === undefined) {
    return next(new restify.InvalidArgumentError('apikey must be supplied and valid'))
  }

  //pXRZzQ01xRQp1xB1kwaKmkAU
  client.basicAuth(myKey, '');
  client.get('/api/products.json', function(err, cReq, cRes, obj) {
    // assert.ifError(err);
    if(err) {
      console.log("Error!");
      res.send(500);
      return next(err);
    } else {
      // console.log(JSON.stringify(obj, null, 2));
      // console.log('%j', obj);
      console.log("Get Success, Responding...");
      res.send(200, obj);
      return next();
    }
  });
}

//PUT function
function updateProduct(req, res, next) {
  console.log(req.params.name);
  // console.log(req.body.name);
  res.send(200);
  next();
}

//Create the client to access the external api from highwire
var client = restify.createJsonClient({
  url: 'https://app.highwire.com'
});

//Create the server to accept requests from the browser
//to access the external api indirectly
var server = restify.createServer();

//Allow Cross Origin Requests
server.use(restify.CORS());
server.use( function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  });
//REST API
server.get('/api/:apikey/product', getProduct);
server.put('/api/:apikey/product', updateProduct);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
