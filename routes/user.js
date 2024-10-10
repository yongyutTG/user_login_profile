// import Swal from 'sweetalert2'


const bcrypt = require('bcrypt');

exports.signup = function(req, res) {
    message = '';
    if (req.method == "POST") {
        const post = req.body;
        const username = post.username;
        const password = post.password;
        const fname = post.first_name;
        const lname = post.last_name;
        const mobile = post.mobile;

        if (username !== '' && password !== '') {
            // เข้ารหัสรหัสผ่านด้วย bcrypt
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) {
                    message = "Error in password encryption.";
                    res.render('signup', { message: message });
                    return;
                }

                // SQL statement พร้อมกับรหัสผ่านที่เข้ารหัสแล้ว
                const sql = "INSERT INTO `users`(`first_name`,`last_name`,`mobile`,`username`, `password`) VALUES (?, ?, ?, ?, ?)";
                
                const query = db.query(sql, [fname, lname, mobile, username, hash], function(err, result) {
                    if (err) {
                        message = "Error in account creation.";
                        res.render('signup', { message: message });
                    } else {
                        message = "Your account has been created successfully.";
                        res.render('signup', { message: message });
                    }
                });
            });
        } else {
            message = "Username and password are mandatory fields.";
            res.render('signup', { message: message });
        }

    } else {
        res.render('signup');
    }
};
//Code เก่า signup
// exports.signup = function(req, res) {
//     message = '';
//     if (req.method == "POST") {
//         var post = req.body;
//         var username = post.username;
//         var password = post.password;
//         var fname = post.first_name;
//         var lname = post.last_name;
//         var mobile = post.mobile;
//         if (username != '' && password != '') {
//             var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mobile`,`username`, `password`) VALUES ('" + fname + "','" + lname + "','" + mobile + "','" + username + "','" + password + "')";

//             var query = db.query(sql, function(err, result) {
//                 message = "Your account has been created succesfully.";
//                 res.render('signup', { message: message });
//             });
//         } else {
//             message = "Username and password is mandatory field.";
//             res.render('signup', { message: message });
//         }

//     } else {
//         res.render('signup');
//     }
// };


// exports.login = function(req, res) {
//     var  message = '';
//    console.log(message);
//    const user = req.session;

//    if (req.method === "POST") {
//        var post = req.body;
//        var username = post.username;
//        var password_login = post.password;
//        var sql = "SELECT id, first_name, last_name, username, password FROM `users` WHERE `username` = ?";
//        db.query(sql, [username], function(err, results) {
//            if (err) {
//                message = 'Error occurred during login.';
//                res.render('index.ejs', { message: message });
//                return;
//            }
//            if (results.length > 0) {
//             //console.log(results);
//                const storedHash = results[0].password;
//                // ตรวจสอบรหัสผ่านกับ hash ที่เก็บไว้
//             bcrypt.compare(password_login, storedHash, (err, match) => {
//                 //console.log("password", storedHash)  
//                 if (match) {
//                     res.redirect('/home/dashboard');
//                 } else {
                   
//                 }
//             });
//            } else {
//                message = 'Username ไม่ถูกต้อง.';
//             res.render('index.ejs', { message: message });
//            }
//        });
//    } else {
//        res.render('index.ejs', { message: message });
//    }
// };

exports.login = function(req, res) {
    var message = '';
    console.log(message);
    var user = req.session;
    if (req.method == "POST") {
        var post = req.body;
        var username = post.username;
        var password = post.password;
        var sql = "SELECT id, first_name, last_name, username FROM `users` WHERE `username`='" + username + "' and password = '" + password + "'";
        db.query(sql, function(err, results) {
            if (results.length) {
                req.session.userId = results[0].id;
                req.session.user = results[0];
                console.log(results[0].id);
                res.redirect('/home/dashboard');
            } else {
                message = 'Username or Password ไม่ถูกต้อง.';
                res.render('index.ejs', { message: message });
            }
        });
    } else {
        res.render('index.ejs', { message: message });
    }
};





exports.dashboard = function(req, res, next) {
     var user = req.session.user,
     userId = req.session.userId;
     console.log(req.session)
    console.log('loging =' + userId);
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function(err, results) {
        res.render('dashboard.ejs', { data: results });
    });
};

exports.profile = function(req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function(err, result) {
        res.render('profile.ejs', { data: result });
    });
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect("/login");
    })
};