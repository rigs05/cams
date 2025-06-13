// DEFINING ALL THE MODULES AND APIs
const express = require("express");
const path = require("path")
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const moment = require("moment");
const jwt = require("jsonwebtoken");    // Adding the JWT package
const app = express();
const cookieParser = require("cookie-parser");
const token = process.env.JWT_SECRET;
const { promisify } = require("util");


// CONNECTING WITH THE DATABASE
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
      console.log(err);
    } else {
        console.log("MYSQL CONNECTED");
    }
})

// CALLING THE DEFINED MODULES FOR USE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'html');

// DEFINE ROUTES
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


// Fetching EmpID for pages
app.get('/api/getempId', async (req, res) => {
  if (req.cookies.userSave) {
    try {
        // console.log (req.cookies.userSave);  
      
      // 1. Verify the token
        const decoded = await promisify(jwt.verify)(req.cookies.userSave,
          process.env.JWT_SECRET
        );
        const empID = decoded.empID;
        const jData = {
          "empid": empID
        }
        res.json(jData); // Return the data as JSON response

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred' });
    }
  } else {
        console.log('No token found.');
    }
});


// Fetching User ID Information
app.get('/api/getId', async (req, res) => {
  if (req.cookies.userSave) {
    try {
        // console.log (req.cookies.userSave);  
      
      // 1. Verify the token
        const decoded = await promisify(jwt.verify)(req.cookies.userSave,
          process.env.JWT_SECRET
        );
        const empID = decoded.empID;
        
        const userData1 = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM management WHERE empID = ?', [empID], (err, result) => {
              if (err) throw err;
              resolve(result[0]);
          });
        });

        const userData2 = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM employee WHERE empID = ?', [empID], (err, result) => {
              if (err) throw err;
              resolve(result[0]);
          });
        });
        
        const userData3 = await new Promise((resolve, reject) => {
          db.query('SELECT * FROM official WHERE empID = ?', [empID], (err, result) => {
              if (err) throw err;
              resolve(result[0]);
          });
        });

        const jData = {
          "empid": empID,
          "userid": userData1.userID,
          "name": userData2.name,
          "dob": moment(new Date(userData2.dob)).format('DD-MMM-YYYY'),
          "mobile": userData2.mobile,
          "email": userData2.email,
          "address": userData2.address,
          "department": userData3.department,
          "designation": userData3.designation,
          "joining_date": moment(new Date(userData3.dateofjoin)).format('DD-MMM-YYYY')
        }
        res.json(jData); // Return the data as JSON response

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred' });
    }
  } else {
        console.log('No token found.');
    }
});


// ADMINISTRATOR PAGE DYNAMIC CONTENT FETCHING FROM DATABASE
app.get('/api/content', async (req, res) => {
  if (req.cookies.userSave) {
    try {
      // 1. Verify the token
        const decoded = await promisify(jwt.verify)( req.cookies.userSave, process.env.JWT_SECRET );
        const empid = decoded.empID;
        const Data1 = await new Promise((resolve, reject) => {
          db.query('SELECT employee.name, employee.empID, attendance.datetime, attendance.presabs, management.remarks FROM employee INNER JOIN attendance ON employee.empID = attendance.empID INNER JOIN management ON employee.empID = management.empID ', (err, result) => {
              if (err) throw err;
              resolve(result);
          });
        });
        // console.log(Data1);
        const jData = Data1.map((item) => {
          return {
              empID: item.empID,
              name: item.name,
              datetime: moment(new Date(item.datetime)).format('DD-MMM-YYYY - HH:MM'),
              attendance: item.presabs,
              remarks: item.remarks,
          };
        });
        res.json(jData);  // Returning data as JSON file response

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred' });
    }
  } else {
        console.log ('No tokens found');
  }
});



// COMPLAINT PAGE FETCHED FROM DATABASE
app.get('/api/comp', async (req, res) => {
  if (req.cookies.userSave) {
    try {
      // 1. Verify the token
        const decoded = await promisify(jwt.verify)( req.cookies.userSave, process.env.JWT_SECRET );
        const empid = decoded.empID;
        const Data1 = await new Promise((resolve, reject) => {
          db.query('SELECT employee.name, feedback_complaint.feedcomplaint, feedback_complaint.empID FROM employee INNER JOIN feedback_complaint ON employee.empID = feedback_complaint.empID ', (err, result) => {
              if (err) throw err;
              resolve(result);
          });
        });
        // console.log(Data1);
        const jData = Data1.map((item) => {
          return {
              empID: item.empID,
              name: item.name,
              txt: item.feedcomplaint
          };
        });
        res.json(jData);  // Returning data as JSON file response
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred' });
    }
  } else {
        console.log ('No tokens found');
  }
});


// OPENING THE PORT FOR THE LOCALHOST SERVER
app.listen(5000)



///////////////////////////////////////////////////////////////////////////////////////////////////////
// app.use('/fetch', require('./routes/fetchDash'));


// FETCHING INFORMATION FROM DATABASE FOR MAINDASH.HTML
// app.get('/api/user/:userId', async (req, res) => {
//   console.log("dohigs ---- 1");
//   const userId = req.params.userId;
//   try{
//     const userData1 = await new Promise((resolve, reject) => {
//         db.query('SELECT empID FROM management WHERE userID = ?', [userId], (err, result) => {
//           if (err) throw err;
//           // console.log('XXX');
//           // console.log(userId + ' ' + result[0].empID);
//           resolve(result[0].empID);
//         });
//       });
//       // console.log('asdfasdfasdfasdf');
//       const empID = userData1;
//       // console.log(userData1);


//       const userData2 = await new Promise((resolve, reject) => {
//         db.query('SELECT * FROM employee WHERE empID = ?', [empID], (err, result) => {
//             if (err) throw err;
//             resolve(result[0]);
//         });
//       });
      
//       const userData3 = await new Promise((resolve, reject) => {
//         db.query('SELECT * FROM official WHERE empID = ?', [empID], (err, result) => {
//             if (err) throw err;
//             resolve(result[0]);
//         });
//       });

//       console.log("dohigs ---- 2");
      
//       const jData = {
//         "empid": userData1,
//         "userid": userId,
//         "name": userData2.name,
//         "dob": moment(new Date(userData2.dob)).format('DD-MMM-YYYY'),
//         "mobile": userData2.mobile,
//         "email": userData2.email,
//         "address": userData2.address,
//         "department": userData3.department,
//         "designation": userData3.designation,
//         "joining_date": moment(new Date(userData3.dateofjoin)).format('DD-MMM-YYYY')
//       }
  
//       res.json(jData); // Return the data as JSON response
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ error: 'An error occurred' });
//     }
// });