var ObjectId = require('mongodb').ObjectID; 


exports.index = function(req, res){
  req.session.usernameTitle = req.param('uName');
 var msgValue = req.session.loginMsg ? req.session.loginMsg : " ";  //message variable that holds the string of sessions

  res.render('index', { title: 'Login', msg: msgValue, username: req.session.usernameTitle });
};

exports.registerPlayer = function(req, res){
  res.render('registerPlayer', { title: 'Register Player' });
};

exports.registerClub = function(req, res){
  res.render('registerClub', { title: 'Register Team' });
};

exports.selectPlayer = function(req, res){
  var db = req.app.settings.db;
  
  var clubCODE = req.param('code');

var titleNew = req.session.USERNAMETITLE;

  db.collection('alluser', function(err, collection) {
    collection.find({playerClubCode:clubCODE}).toArray(function(err, docs) { 
   res.render('selectPlayer', {title: 'Select Player', players: docs, pageTitle:titleNew});

    });
  });

};



exports.addNewClub = function(req, res){
 var db = req.app.settings.db;
  
  var manUser =  req.session.USERNAMETITLE;


  db.collection('allClubs', function(err, collection) {
    collection.find({username:manUser}).toArray(function(err, docs) {

  var a = docs[0].managerName;
  var b = docs[0].username;
  var c = docs[0].password;
  var d = docs[0].managerEmail;
  
  
  res.render('addNewClub', { title: 'Add New Team', A:a, B:b, C:c, D:d});
});
  });

};


exports.pickAndDelete = function(req, res){
  var db = req.app.settings.db;

var titleNew = req.session.USERNAMETITLE;
  
  db.collection('allClubs', function(err, collection) {
    collection.find({username:titleNew}).toArray(function(err, docs) {
      res.render('pickAndDelete', {title: 'Delete Team', clubs: docs, pageTitle:titleNew});
    });
  });

};




exports.dashboard = function(req, res) {
  var db = req.app.settings.db;

var titleNew = req.session.USERNAMETITLE;
  
  db.collection('allClubs', function(err, collection) {
    collection.find({username:titleNew}).toArray(function(err, docs) {
      res.render('dashboard', {title: 'Dashboard', clubs: docs, pageTitle:titleNew});
    });
  });

};











exports.processRegisterClub = function(req, res) {
  var db = req.app.settings.db;

  var manName = req.param('fullManagerName');
  var cname = req.param('clubName');
  var ccode = req.param('clubCode');
  var manageruname = req.param('userName');
  var managerpwd = req.param('passWord');
  var managermail = req.param('managerEmail');


  if (manName && cname && ccode && manageruname && managerpwd && managermail)
  {
    //var users = db.get('users');
    db.collection('allClubs', function(err, collection) {

      var clubDetails = {
        managerName: manName,
        clubName: cname,
        clubCode: ccode,
        username: manageruname,
        password: managerpwd,
        managerEmail: managermail
      };

      collection.insert(clubDetails, {w:1}, function (err, result) {
        if (err) throw err;

        console.log("New Club: ", result);
        res.redirect('/');
      });

    });

  }
};


exports.processNewRegisterClub = function(req, res) {
  var db = req.app.settings.db;

  var manName = req.param('fullManagerName');
  var cname = req.param('clubName');
  var ccode = req.param('clubCode');
  var manageruname = req.param('userName');
  var managerpwd = req.param('passWord');
  var managermail = req.param('managerEmail');


  if (manName && cname && ccode && manageruname && managerpwd && managermail)
  {
    //var users = db.get('users');
    db.collection('allClubs', function(err, collection) {

      var clubDetails = {
        managerName: manName,
        clubName: cname,
        clubCode: ccode,
        username: manageruname,
        password: managerpwd,
        managerEmail: managermail
      };

      collection.insert(clubDetails, {w:1}, function (err, result) {
        if (err) throw err;

        console.log("New Club: ", result);
        res.redirect('/dashboard');
      });

    });

  }
};


exports.processRegisterPlayer = function(req, res) {
  var db = req.app.settings.db;

  var playerFullName = req.param('playerName');
  var playerUname = req.param('playerUserName');
  var playerPass = req.param('playerPassWord');
  var playerEmail = req.param('playerEmail');
  var playerClubCode = req.param('clubCode');


  if (playerFullName && playerUname && playerPass && playerEmail && playerClubCode)
  {
    db.collection('alluser', function(err, collection) {

      var playerDetails = {
        playerName: playerFullName,
        playerUsername: playerUname,
        playerPassword: playerPass,
        playerEmail: playerEmail,
        playerClubCode: playerClubCode
      };

      collection.insert(playerDetails, {w:1}, function (err, result) {
        if (err) throw err;

        console.log("New Player: ", result);
        res.redirect('/');
      });

    });

  }
};




exports.processLogin = function (req, res) {
  var db = req.app.settings.db;



  var loginUser = req.param('uName');
  var loginPass = req.param('pWord');

  if (loginUser || loginPass)  {
    db.collection('allClubs', function (err, collection) {
      if (err) throw err;

      collection.find({username: loginUser}).toArray(function (err, arrayOfClubs) {
          if (err) throw err;

          if (arrayOfClubs.length == 0) {
                            console.log(arrayOfClubs.length);
                                      req.session.loginMsg = "Sorry. User not found";


            res.redirect('/');
          }else {
              if (arrayOfClubs[0].password == loginPass) {
                 req.session.USERNAMETITLE = loginUser;

                res.redirect('/dashboard');

              }
              else {
                req.session.loginMsg = "Sorry. Wrong password.";   //but if the values don't match redirect back to the login page and send 

                res.redirect('/');
              }
            }
        });
    });
  }
}




exports.deleteClub = function (req, res) {
  //in this function I am checking the id of the list that I want to delete and the by accessing the lists
  //collection I am removing the list form the collection based on the _id and then redirecting back to the dashboard
  var db = req.app.settings.db;
  var clubId = req.param('CLUBID');
  var delCode = req.param('CLUBCODE');

  

  if (!clubId) {
    res.redirect('/dashboard');
  } 
  else {
    var clubObjectID = new ObjectId(clubId);

//this code below is getting all the lists collection and removing the list which id is equal to the list ObjectID

    db.collection('allClubs', function (err, ListCollection){
      ListCollection.remove({_id: clubObjectID}, {w:1}, function (err, result) {
        if (err) throw err;
        console.log("Club Removed: ", result);

            db.collection('a', function (err, itemCollection){
              itemCollection.remove({playerClubCode: delCode}, {w:1}, function (err, result) {
                if (err) throw err;
                  console.log("items Removed: ", result);
      res.redirect('/dashboard');
      });
    });
    });
  });
  }
}





exports.logout = function (req, res) {
  if (req.session.USERNAMETITLE){
    delete req.session.USERNAMETITLE;
  }
    
  res.redirect('/');
};






exports.profilePlayer = function (req, res) {

  var db = req.app.settings.db;
  var titleNew = req.session.USERNAMETITLE;


 var playerUser = req.param('user');
 var userDis = req.param('userDisplay');


  db.collection('gpsdata', function (err, theDataCollection) {
    if (err) {
    
      throw err;
    }
    theDataCollection.find({userAjax: playerUser})
      .sort('_id','desc')
      .toArray(function(err, resultsArray) {
        if (err) {throw err};

       
            var latesResult = resultsArray[0];

   var reversedArray = resultsArray.reverse()
        
        res.render('profilePlayer', {title: 'Player Profile', dataFromDB: reversedArray, timeJade: latesResult, pageTitle:titleNew, displayUser:userDis});
      });

  });
};





/*db.ajaxdata.insert({userAjax: 'sean', date:'25/04/2014',latv:'78.134123', lonv:'43.342123', distance:'9', hoursVal:'0', minutesVal:'0', secondsVal:'12', acc: 'null' })*/