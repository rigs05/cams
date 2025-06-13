// CALLING ALL THE MODULES AND APIs
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const path = require ('path');

// CONNECTING WITH THE DATABASE
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});


// LOGIN MODULE
exports.login = async (req, res) => {
    try {
        const { userID, empPass, remarks } = req.body;
        if (!userID || !empPass) {
            return res.status(401).send(`<script>alert("Please Provide an email and password"); window.location.href = '/login.html';</script>`);  
        }
        
        db.query('SELECT password FROM management WHERE userID = ?', [userID], async (err, results) => {
            if(typeof results[0] === 'undefined' || !results) {
              return res.status(401).send(`<script>alert("Please register or provide correct userID"); window.location.href = '/login.html';</script>`);  
        
            }
            else if (!await bcrypt.compare(empPass, results[0].password)) {
              return res.status(401).send(`<script>alert("UserID or Password is incorrect"); window.location.href = '/login.html';</script>`);  
            } else {
                const query1 = 'SELECT e.usertype FROM employee e INNER JOIN management m ON e.empID = m.empID WHERE m.userID = ? '
                const usertype = await new Promise((resolve, reject) => {
                  db.query(query1, [userID], (err, result) => {
                    if (err) throw err;
                    resolve(result[0].usertype);
                  });
                });
                
                // Insert remarks into the management table
                const insertRemarks = 'UPDATE management SET remarks = ? WHERE userID = ?';
                db.query(insertRemarks, [remarks, userID], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Remarks inserted successfully');
                    }
                });

                // Code to mark attendance Inserted from here:-
                const empIDQuery = 'SELECT empID FROM management WHERE userID = ?';
                db.query(empIDQuery, [userID], (err, empIDRes) => {
                  if (err || empIDRes.length === 0) {

                    console.log(err || 'No empID found');
                    // Handle the error or empty result
                  } else {
                    var empID = empIDRes[0].empID;
                    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in the format 'YYYY-MM-DD'
                    const checkEntry = 'SELECT * FROM attendance WHERE empID = ? AND DATE(datetime) = ?';
                    const datetime = new Date();
                    const presabs = 'Present';
                    db.query(checkEntry, [empID, currentDate], (err, checkRes) => {
                      if (err) {     // Handle the error
                        console.log(err);
                      } else if (checkRes.length > 0){
                        // Attendance already marked for current date
                        console.log('Attendance already marked for today');
                      } else {
                        const query2 = 'INSERT INTO attendance (empID, datetime, presabs) VALUES (?, ?, ?)';
                        db.query(query2, [empID, datetime, presabs], (err, result) => {
                          if (err) {  // Handle the error
                            console.log(err);
                          } else {
                            // Attendance marked successfully
                            console.log('Attendance Marked!');
                          }
                        });
                      }
                    });
                  }
                });
                // Extracting EmpID from User-ID at the time of Login
                const userData1 = await new Promise((resolve, reject) => {
                  db.query('SELECT empID FROM management WHERE userID = ?', [userID], (err, result) => {
                    if (err) throw err;
                    resolve(result[0].empID);
                  });
                });

                // JWT token generation for session management: 
                const token = jwt.sign({ empID: userData1 }, process.env.JWT_SECRET, {
                  expiresIn: process.env.JWT_TOKEN_EXPIRES
                });
                console.log ('token: ' + token);    // Prints the Token generated
                console.log ('emp: ' + userData1);  // Prints the EmpID
                
                // Cookie generation:
                const cookieOptions = {
                    expires: new Date(
                      Date.now() + (24 * 60 * 60 * 1000)
                    ),
                    empID: userData1,
                    httpOnly: true
                }
                console.log(cookieOptions); // Printing the Cookie in Console

                // Redirect the user to the appropriate dashboard based on the usertype
                if (usertype === 'Admin') {
                  res.cookie('userSave', token, cookieOptions);
                  return res.status(200).redirect(`/admindash.html`);

                } else if (usertype === 'Emp') {
                  console.log("gd --- 4 --- "+usertype);
                  res.cookie('userSave', token, cookieOptions);
                  return res.status(200).redirect(`/maindash.html`);
                }
            }
        })
    } catch (err) {
        console.log(err);
  }
}


// REGISTER EMPLOYEE MODULE
exports.register = async (req, res) => {
  if (req.cookies.userSave) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.userSave,
        process.env.JWT_SECRET
      );
      // Declaring the variables
      const { usertype, userID, empName, empDOB, empMobile, empMail, empAdd, empPass, empDept, empDesig } = req.body;

        
      // Check if email already exists in the employee table
      const emailExists = await new Promise((resolve, reject) => {
        db.query('SELECT email FROM employee WHERE email = ?', [empMail], (err, result) => {
          if (err) throw err;
          resolve(result[0]);
        });
      });

      // Checking if Email already exists in the Database
      if (emailExists) {
        return res.json({ status: 'error', error: 'Email has already been registered' });
      }
      
      // HASHING THE PASSWORD
      let hashedPassword = await bcrypt.hash (empPass, 8);

      // Insert data into employee table
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO employee SET ?',
          { name: empName, dob: empDOB, mobile: empMobile, email: empMail, address: empAdd, usertype },
          (error, results) => {
            if (error) throw error;
            resolve(results);
          }
        );
      });

      // Entering details into different tables
      const empID = await new Promise((resolve, reject) => {
        db.query('SELECT empID FROM employee WHERE email = ?', [empMail], (err, result) => {
          if (err) throw err;
          resolve(result[0].empID);
        });
      });

      console.log("New Employee ID assigned: "+ empID); // Shows the randomly generated EmpID in Console
  
      // Insert data into management table
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO management SET ?',
          { userID: userID, password: hashedPassword, empID: empID },
          (err1, res1) => {
            if (err1) reject(err1);
            resolve(res1);
          }
        );
      });
  
      // Insert data into official table
      await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO official SET ?',
          { designation: empDesig, department: empDept, dateofjoin: new Date(), empID: empID },
          (err2, res2) => {
            if (err2) reject(err2);
            resolve(res2);
          }
        );
      });
  
      // PRINTING AND REDIRECTING TO LOGIN PAGE AFTER SUCCESSFUL REGISTRATION
      console.log('Data inserted successfully into all tables');
      // res.status(401).send(`<script>alert("User successfully registered, Please Login to continue."); window.location.href = '/login.html';</script>`)
      res.status(401).send(`<script>alert("User successfully registered, Please Login to continue.");</script>`)
      res.redirect('/register');
    } catch (error) {   // PROMPTLY HANDLING ERRORS
      console.error(error);
      return res.json({ status: 'error', error: 'An error occurred during registration' });
    }
}};


// SESSIONS MODULE
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.userSave) {
        try {
            // 1. Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave,
                process.env.JWT_SECRET
            );

            // 2. Check if the user still exist
            db.query('SELECT * FROM employee WHERE empID = ?', [decoded.empID], (err, results) => {
                // console.log(results);
                if (!results) {
                    return next();
                }
                req.employee = results[0];
                return next();
            });
        } catch (err) {
            console.log(err)
            return next();
        }
    } else {
        next();
    }
}


// FEEDBACK MODULE
exports.fback = async (req, res) => {
  
  if (req.cookies.userSave) {
    try {     
      // 1. Verify the token
        const decoded = await promisify(jwt.verify)(req.cookies.userSave,
          process.env.JWT_SECRET
        );
        const empID = decoded.empID;
        const { reqtype, txt } = req.body;
        
        // Inserting New Feedback or Complaint in the table
        await new Promise((resolve, reject) => {
          db.query( 'INSERT INTO feedback_complaint SET ?', { 'empID': empID, 'type': reqtype, 'feedcomplaint': txt  }, (error, results) => {
              if (error) throw error;
              resolve(results);
          });
        });
        res.redirect('/feedback');    // Redirecting back to the same page
    } catch (error) {       // HANDLE ERRORS
        console.error(error);
        return res.json({ status: 'error', error: 'An error occurred while catching' });
    }
  } else {
        console.log('No token found.');
    }
}


// LOGOUT MODULE
exports.logout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).redirect("/login");
}







/************************************************************************************************** */
// KOODA



// export :
    // exports.register = (req, res) => {
    //     console.log ('test 2');
    //     console.log(req.body);
    //     const { name, email, password, passwordConfirm } = req.body;
    //     db.query('SELECT email from employee WHERE email = ?', [email], async (err, results) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             if (results.length > 0) {
    //                 return res.sendFile(__dirname + "request.html", {
    //                     message: 'The email is already in use'
    //                 })
    //             } else if (password != passwordConfirm) {
    //                 return res.sendFile(__dirname + "request.html", {
    //                     message: 'Password dont match'
    //                 });
    //             }
    //         }

    //         let hashedPassword = await bcrypt.hash(password, 8);
    //         console.log(hashedPassword);

    //         db.query('INSERT INTO employee SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 return res.sendFile(__dirname + "request.html", {
    //                     message: 'User registered'
    //                 });
    //             }
    //         })
    //     })
    //     res.send("Form submitted");
    // }


// REDUNDANT CODE:
// exports.register = (req, res) => {
//     console.log("test 1");
//     console.log (req.body);
//     const { userID, empName, empDOB, empMobile, empMail, empAdd, empPass, empDept, empDesig } = req.body;


//     db.query ( "SELECT email FROM employee WHERE email = ?", [empMail], async (err, result) => {
//         if (err) throw err;
//         if (result[0]) return res.json({status: "error", error: "Email has already been registered" })
//         else {
//             db.query ('INSERT INTO employee SET ?', { name: empName, dob: empDOB, mobile: empMobile, email: empMail, address: empAdd}, (error, results) =>{
//                 if (error) throw error;
//                 console.log("success in employee db");
//                 db.query ( 'INSERT INTO management SET ?', {userID: userID, password: empPass }, (err1, res1) => {
//                     if (err1) throw err1;
//                     console.log ("success in management db");
//                     db.query ( 'INSERT INTO official SET ?', {designation: empDesig, department: empDept }, (err2, res2) =>{
//                         if (err2) throw err2;
//                         // console.log ("success in official db");
//                         return("success in official db");
//                     })
//                 })
//                 return results.json({ status: "success", success: "User registered"});
//             })
//         }
//     })
//     res.send("Form submitted");
// }