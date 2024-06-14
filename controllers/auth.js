const User = require('../models/user');


exports.getLogin = (req, res) => {

   

    res.render('auth/login', {
        path: '/Login',
        pageTitle: 'ورود',
        isAuthenticated: false
    });
}


exports.postLogin = (req, res) => {
    User.findById('620a576a20c16a2c3c9a8cd2').then(
        user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err=>{
                console.log(err);
                res.redirect('/');
            }

            )
            
        }
    )

}

exports.postLogout = (req, res) => {

    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}