const e = require('express');
const { sequelize, User, Role } = require('../models');  // Import sequelize and models
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // Make sure to include bcrypt


const loginForm = (req, res) => {
    let message = null;
    if (req.cookies.message) {
        try {
            message = JSON.parse(req.cookies.message);
        } catch (e) {
            console.error('Error parsing message cookie:', e);
        }
        res.clearCookie('message');
    }
    res.render('login', { message });
}

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const loginUser = async (req, res) => {
    try {
        if (!req.body.username) {
            res.cookie('message', JSON.stringify({type: 'error', text: 'Username wajib diisi'}), {maxAge: 60000});
            return res.redirect('/auth/login');
        } 
        if (!req.body.password) {
            res.cookie('message', JSON.stringify({type: 'error', text: 'Password wajib diisi'}), {maxAge: 60000});
            return res.redirect('/auth/login');
        }

        const userData = await User.findOne({ where: { username: req.body.username } })
        console.log(userData);
        
        if (!userData || !(await userData.CorrectPassword(req.body.password, userData.password))) {
            
            res.cookie('message', JSON.stringify({type: 'error', text: 'Username atau password salah'}), {maxAge: 60000});
            return res.redirect('/auth/login');
        }

        const token = signToken(userData.idUser, userData.namaRole);
        
        const cookieOption = {
            expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true
        };  

        res.cookie('jwt', token, cookieOption);

        const adminRoleId = await Role.findOne({ where: { namaRole: 'admin' } }).then(namaRole => namaRole.idRole);
        const userRoleId = await Role.findOne({ where: { namaRole: 'user' } }).then(namaRole => namaRole.idRole);

        res.cookie('message', JSON.stringify({type: 'success', text: 'Login berhasil!', timeout: 1000}), {maxAge: 3000})
       
        if (userData.idRole === adminRoleId) {
            return res.redirect('/admin/dashboard')
        } else if (userData.idRole === userRoleId) {
            return res.redirect('/user/dashboard')
        }


    } catch (error) {
        // Extract error message and stack trace
        const errorMessage = error.message || 'An error occurred';
        const errorStack = error.stack || '';

        res.cookie('message', JSON.stringify({type: 'error', text: errorMessage, stack: errorStack}), {maxAge: 60000});
        return res.redirect('/auth/login');
    }

}

const logoutUser = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    return res.redirect('/');
    res.status(200).json({
        message: 'Berhasil logout'
    })
}

const registerForm = (req, res) => {
    // Check for any messages passed in cookies
    const message = req.cookies.message ? JSON.parse(req.cookies.message) : null;
    
    res.cookie('message', '', { maxAge: 1000, httpOnly: true });

    // Render the registration page and pass the message
    res.render('register', { message });
}


const registerUser = async (req, res) => {
    try {
        const { username, password,confirmPassword, nama, gender, noHp } = req.body;

        if (!username || !password || !nama || !gender || !noHp) {
            res.cookie('message', JSON.stringify({ type: 'error', text: 'Semua field wajib diisi' }), { maxAge: 60000 });
            return res.redirect('/auth/register');
        }

        if (password !== confirmPassword) {
            res.cookie('message', JSON.stringify({ type: 'error', text: 'Password tidak sama' }), { maxAge: 60000 });
            return res.redirect('/auth/register');
        }   

        const userRole = await sequelize.models.Role.findOne({ where: { namaRole: 'user' } });

        if (!userRole) {
            console.error();
            res.cookie('message', JSON.stringify({ type: 'error', text: 'Role pengguna tidak ditemukan' }), { maxAge: 60000 });
            return res.redirect('/auth/register');
        }


        const user = await User.create({
            username,
            password,
            nama,
            gender,
            noHp,
            idRole: "1"
        });
        console.log(user);
        
        
        res.cookie('message', JSON.stringify({ type: 'success', text: 'Registrasi berhasil! Silahkan login' }), { maxAge: 60000 });
        return res.redirect('/auth/login');
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.cookie('message', JSON.stringify({ type: 'error', text: 'Internal Server Error' }), { maxAge: 60000 });
        return res.json({ message: error.message });
    }
};


module.exports = {
    loginForm,
    loginUser,
    logoutUser,
    registerForm,
    registerUser
}