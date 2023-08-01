// const axios = require('axios');
// const fs = require('fs');
// const User = require('../models/user');
// const mongoose = require('mongoose');


exports.new_item = (req, res)=> {
    res.render("new-item")
}

exports.login = async (req, res, next) => {
    res.render('login');
}

exports.register =  async (req, res, next) => {
  res.render('register');
}

exports.about = async (req, res, next) => {
  res.render('about');
};


exports.profile = async (req, res, next) => {
  // if (!req.user) {
  //   // User is not authenticated, redirect to login page
  //   return res.redirect('/auth/login');
  // }

  // User is authenticated, render the profile view
  const person = req.user;
  res.render('profile', { person });
};

