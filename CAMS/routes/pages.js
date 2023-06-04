const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.sendFile("login.html", { root: './public/' })
});

// Register page
router.get('/register', authController.isLoggedIn, (req, res) => {
    if (req.employee) {
        res.sendFile("regn.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
});

// Employee Dashboard page
router.get('/maindash', authController.isLoggedIn, (req, res) => {
    if (req.employee) {
        res.sendFile("maindash.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
});

// Admin Dashboard page
router.get('/admindash', authController.isLoggedIn, (req, res) => {
    if (req.employee) {
        res.sendFile("admindash.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
});

// Feedback page for employee
router.get('/feedback', authController.isLoggedIn, (req, res) => {
    if (req.employee) {
        res.sendFile("feedback.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
});

// Complaint page for admin
router.get('/complaint', authController.isLoggedIn, (req, res) => {
    if (req.employee) {
        res.sendFile("complaint.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
});

// System Logs page
router.get('/syslog', authController.isLoggedIn, (req, res) => {
    if (req.employee) {
        res.sendFile("syslog.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
});

// Contact Us page
router.get('/contact', authController.isLoggedIn, (req, res) => {
    if (req.employee) {
        res.sendFile("contact.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
});


module.exports = router;