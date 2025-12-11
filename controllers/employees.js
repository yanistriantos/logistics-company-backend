const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.getEmployees = async (req, res) => {
    try {
        const db = await db;
        const [rowsEmployees] = await db.query("SELECT * FROM employee ORDER BY name");
        res.json(rowsEmployees);
    } catch(err) {
        res.status(500).json({error: "Database error, can't get Employee."});
    }
}

exports.addEmployees = async (req, res) => {
    try{
        const {name, email, role_id, password} = req.body;
        const [resultUser] = await db.query(
            "INSERT INTO users(username, email, password, user_type) VALUES (?, ?, ?, 'staff')",
            [name, email, password]
        );
        const [result] = await db.query(
            "INSERT INTO emplyee(user_id, name, email, role_id,) VALUES (?, ?, ?, ?)",
            [resultUser.insertId, name, email, role_id]
        );
        res.json({id: result.insertId});
    } catch(err) {
        res.status(500).json({error: "Database error, can't add Employee."});
    }
}

exports.updateEmployees = async (req, res) => {
    try{
        const{name, email, role_id, id} = req.body;
         const [result] = await db.query(
            "UPDATE employee SET name = ?, email = ?, role_id = ? WHERE id = ?", [name, email, role_id, id]
        );
        res.json({status: "Employee updated."});
    }catch(err) {
        res.status(500).json({error: "Database error, can't update Employee."});
    }
}