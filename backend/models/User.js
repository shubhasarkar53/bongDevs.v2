const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["user"],
  },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  requestedForAdmin: {
    type: Boolean,
    default: false,
  },
  profile: {
    fullName: String,
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    avatar: String,
    social: {
      linkedin: String,
      twitter: String,
      github: String,
    },
  },
  bankAccount: {
    bankName: String,
    accountNumber: {
      type: String,
      // required: true
    },
    ifscCode: String,
    upiHandle: String,
  },
});

// hash password along the way while creating user

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);

          user.password = hash;
          next();
      });
  });
});


userSchema.methods.generateAccessToken = function(){
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

// Custom toJSON method to hide sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.bankAccount;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
