module.exports = function(app, passport, db) {
  ObjectID = require('mongodb').ObjectID

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/barista', isLoggedIn, function(req, res) {
      db.collection('orders').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('barista.ejs', {
          user : req.user,
          orders: result
        })
      })
    });

// message board routes ===============================================================

    app.post('/coffeeOrderForm', (req, res) => {
      db.collection('orders').insertOne({
        name: req.body.name, 
        size: req.body.size, 
        beverage: req.body.beverage,
        sugarLvl: req.body.sugarLvl,
        toppings: req.body.toppings, 
        note: req.body.note,
        complete: false,

      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      })
    })

    app.put('/order-finish', (req, res) => {
      console.log("Here's the body",req.body)
      db.collection('orders')
      .findOneAndUpdate({
        _id: ObjectID(req.body._id)
      }, {
        $set: {
          complete: true,
          thisUser : req.user.local.firstName
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/coffeeOrderForm', (req, res) => {
      db.collection('orders').findOneAndDelete({_id: ObjectID(req.body._id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/barista', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/barista', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
