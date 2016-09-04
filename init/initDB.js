var models = require('../server/models/index');
var fixtures = require('sequelize-fixtures');
var request = require('request');
var throttledRequest = require('throttled-request')(request);
var md5 = require('md5');
var BufferList = require('bufferlist').BufferList;
var jsonQuery = require('json-query')

var nbUsers = 500;

throttledRequest.configure({
  requests: 5,
  milliseconds: 2000
});

initSQL();

function initSQL() {
  console.log("dropping tables");
  models.sequelize.drop();
  console.log("synching tables");
  models.sequelize.sync({force: true}).then(
    function () {
      seedDB();
    }
  );
}

function seedDB() {
  fixtures.loadFile("./init.json", models).then(function(){
    createRandomUsers(nbUsers);
  });
};

function createRandomUsers(nb) {
  console.log("querying randomuser.me for "+nb+" users");
  var randomUri = 'http://api.randomuser.me/?inc=name,email,phone,cell,location,picture,login&nat=fr&noinfo&results='+nb;
  var maxStudentYear = 11;
  var maxUserType = 7;
  var currentIndex = 0;
  request(randomUri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = JSON.parse(body);
      for (i in data.results) {
        var user = data.results[i];
        console.log("creating user "+(i*1+1)+" : "+user.name.first+" "+user.name.last);
        models.user.create({
          barcode: md5(user.name.first+user.name.last+user.login.salt),
          title: user.name.title,
          firstName: user.name.first,
          lastName: user.name.last,
          isRegistered: Math.random()<.5,
          email: user.email,
          cellPhone: user.cell,
          homePhone: user.phone,
          addressStreet: user.location.street,
          addressCity: user.location.city,
          addressState: user.location.state,
          addressPostcode: user.location.postcode,
          loginUsername: user.login.username,
          loginPassword: user.login.password,   // FOR DEVELOPMENT ONLY, MUST BE REMOVED IN PRODUCTION
          loginSalt: user.login.salt,
          loginMD5: user.login.md5,
          loginSHA1: user.login.sha1,
          loginSHA256: user.login.sha256,
          userTypeId: Math.ceil(Math.random() * maxUserType),
          studentYearId: Math.ceil(Math.random() * maxStudentYear),
        }).then(function(sqluser) {
          // find picture uri
          var qres = jsonQuery('results.login[md5='+sqluser.loginMD5+']', {
            data: data
          });
          var uri = data.results[qres.key].picture.large;
          var bl = new BufferList();
          // download picture and create entry in database
          throttledRequest({uri:uri, encoding:'binary'}, function (error, response, body) {
            currentIndex++;
            var index = currentIndex;
            console.log("downloading picture for user "+index+"/"+nbUsers+" : "+sqluser.firstName+" "+sqluser.lastName);
            if (!error && response.statusCode == 200) {
              data_uri_prefix = "data:" + response.headers["content-type"] + ";base64,"
              image = new Buffer(body.toString(), "binary").toString("base64");
              image = data_uri_prefix + image;
              models.document.create({
                type: "userProfilePic",
                content: image
              }).then(function (pic) {
                sqluser.addPicture(pic);
              });
              console.log("userProfilePic added for user "+index+"/"+nbUsers+" : "+sqluser.firstName+" "+sqluser.lastName)
            } else {
              console.error("error downloading picture for user "+index+"/"+nbUsers+" : "+sqluser.firstName+" "+sqluser.lastName);
              console.error(error);
            };
          });
        })
      }
    }
  })
}

