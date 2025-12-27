const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getRegister = (req, res) => {
  res.status(200).json({ message: "Register page" });
};

exports.getLogin = (req, res) => {
  res.status(200).json({ message: "Login page" });
};

exports.register = async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body; //const username = req.body.name

  //  Check if email already exists and passwords match
  db.query(
    "SELECT *  FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "That email is already registered" });
      }

      if (password !== passwordConfirm) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      let hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      db.query(
        "INSERT INTO users SET ?",
        { username: username, email: email, password: hashedPassword },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            return res
              .status(201)
              .json({ message: "User registered successfully" });
          }
        }
      );
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];
      const matches = await bcrypt.compare(password, user.password);
      if (!matches) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      // Store user information in session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.email = user.email;
      req.session.user_type = user.user_type; // 'client' or 'employee'
      req.session.isAuthenticated = true;

      // Return user information
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          user_type: user.user_type,
        },
      });
    }
  );
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
};

exports.getSession = (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        email: req.session.email,
        user_type: req.session.user_type,
      },
    });
  }
  return res.status(200).json({
    isAuthenticated: false,
    user: null,
  });
};
