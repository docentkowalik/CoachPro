
exports.compareLogin = function(req, res) {
  // Get the connection to the Mongo DB
  var db = req.app.settings.db;
  var user = req.body;
  var checkUser = user.loginPlayerName;


  var checkUserPass = user.loginPlayerPassword;


db.collection('alluser', function (err, collection) {
      if (err) throw err;

      collection.find({playerUsername:checkUser}).toArray(function (err, arrayOfDocs) {
        if (err) throw err;

        
        if (arrayOfDocs.length == 0) {
        res.send({status: "noUser"});
        }

        else {
              if (arrayOfDocs[0].playerPassword == checkUserPass) {
                res.send({status: "success"});
                  }

          else {
                res.send({status: "wrongPassword"});
          }
        }

        });
      
      });
    }
  


exports.saveData = function(req, res) {
  // Get the connection to the Mongo DB
  var db = req.app.settings.db;

   db.collection('gpsdata', function(err, collection) {
     

      collection.insert(req.body, {w:1}, function (err, result) {
        if (err) throw err;

        console.log("Result of insert: ", result);

        // Write back some JSON containing a status message
        res.send({status: "success"});
      });


    });
}

/*
 *  POST /api/saveData
 */
 exports.getData = function(req, res) {
  // Get the connection to the Mongo DB
  var db = req.app.settings.db;

  // Get the data collection
  db.collection('gpsdata', function(err, collection) {

    collection.find().sort('_id','desc').limit(1, function(err, cursor){
      cursor.nextObject(function(err, doc) {
        if (err) {throw err};
        
        console.log("/api/getData - returning: ", JSON.stringify(doc));
        res.send(doc);
      });
    });

    
  });

 };