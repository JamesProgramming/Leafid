import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs";
import { fileURLToPath } from "url";
import { User } from "../Models/userModel.js";
import { promisify } from "util";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// User signin.
export async function signin(req, res) {
  const { password, employeeId } = req.body.data;

  // Check if credentials are present.
  if (!password || !employeeId || isNaN(employeeId)) {
    return res.status(401).json({
      status: "failure",
      data: {
        message: "Please provide Employee ID and password",
      },
    });
  }

  // Get user.
  const user = await User.findOne({ employeeId });

  // Validate credentials.
  if (!user || !(await bcrypt.compare(password, user?.password))) {
    return res.status(401).json({
      status: "failure",
      data: {
        message: "Employee ID or password not correct",
      },
    });
  }

  // Create JSON web token.
  const token = jwt.sign(
    { id: user._id, date: Date.now() },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  // Add token to response.
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  // Add user theme to responce.
  res.cookie("theme", user.theme);

  return res.status(200).json({
    status: "success",
    data: {
      message: "Logged in.",
    },
  });
}

// User sign out.
export async function signout(req, res) {
  // Remove authorization token.
  res.cookie("jwt", "");
  res.cookie("theme", "");

  return res.status(200).json({
    status: "success",
    data: {
      message: "Logged out.",
    },
  });
}

// Protect route.
export async function protectRoute(req, res, next) {
  // Get token.
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (req.headers.jwt) {
    token = req.headers.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "failure",
      data: {
        message: "You are not logged in !!",
      },
    });
  }

  // Verify token.
  let decode;
  try {
    decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (e) {
    return res.status(401).json({
      status: "failure",
      data: {
        message: e.message,
      },
    });
  }

  // Get user.
  const user = await User.findById(decode.id);

  if (!user) {
    return res.status(401).json({
      status: "failure",
      data: {
        message: "This token belongs to a deleted user.",
      },
    });
  }

  // Make sure password was not updated after token was created.
  if (decode.date < user.updatedPassword) {
    return res.status(401).json({
      status: "failure",
      data: {
        message: "This token is out of date.",
      },
    });
  }

  // Add user to request object.
  req.user = user;

  next();
}

// Get employee info.
export function info(req, res) {
  return res.status(200).json({
    status: "success",
    data: {
      employeeId: req.user.employeeId,
      role: req.user.role,
    },
  });
}

// Update password.
export async function updatedPassword(req, res) {
  // Validate current user password.
  if (
    !req.body?.data?.currentPassword ||
    !(await bcrypt.compare(req.body.data.currentPassword, req.user.password))
  ) {
    return res.status(401).json({
      status: "failure",
      data: {
        message: "Wrong password",
      },
    });
  }

  // Create new password
  const newPassword = await bcrypt.hash(req.body.data.newPassword, 8);

  // Update user password.
  let user;
  try {
    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: newPassword,
        updatedPassword: Date.now(),
      },
      { new: true, runValidators: true }
    );
  } catch (e) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: e.message,
      },
    });
  }

  // Create new JSON web token.
  const token = jwt.sign(
    { id: user._id, date: Date.now() },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  // Append new token to response cookie.
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  return res.status(200).json({
    status: "success",
    data: {
      message: "Updated password",
    },
  });
}

// Protect admin routes.
export function admin(req, res, next) {
  if (req.user.role === "admin") return next();
  return res.status(401).json({
    status: "failure",
    data: {
      message: "You are not authorized on this route",
    },
  });
}

// Create a user.
export async function createUser(req, res) {
  // Verify new user infomation is present.
  if (!req.body?.data) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: "Need user info",
      },
    });
  }
  const payload = req.body.data;

  if (
    !(
      payload?.password &&
      payload?.employeeId &&
      payload?.role &&
      payload?.password
    )
  ) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: "All fields required",
      },
    });
  }

  // Create password hash.
  const password = await bcrypt.hash(req.body.data.password, 8);

  // Add user to database.
  let newUser;
  try {
    newUser = await User.create({
      ...req.body.data,
      password,
    });
  } catch (e) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: e.message,
      },
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      message: newUser.name + " created",
    },
  });
}

// Removes a user
export async function removeUser(req, res) {
  // Validate required infomation is present.
  if (!req.body?.data || !req.body.data?.employeeId) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: "Need user info",
      },
    });
  }

  const payload = req.body.data;

  // Do not allow user to delete themself.
  if (payload.employeeId == req.user.employeeId) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: "Cannot remove yourself",
      },
    });
  }

  // Require password from user to authorize removal.
  if (!(await bcrypt.compare(req.body.data.password, req.user.password))) {
    return res.status(401).json({
      status: "failure",
      data: {
        message: "Incorrect password",
      },
    });
  }

  // Remove user.
  try {
    const user = await User.findOne({ employeeId: payload.employeeId }).select(
      "images"
    );

    // Remove user images.
    user.images.map(async (img) => {
      await promisify(fs.rm)(
        path.join(__dirname, "..", "images", img),
        (err) => {
          console.log(err);
        }
      );
    });

    await Promise.all(user.images);

    await User.findOneAndRemove({ employeeId: payload.employeeId });
  } catch (e) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: e.message,
      },
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      message: payload.employeeId + " removed",
    },
  });
}

// Returns all users on database.
export async function getAllUsers(req, res) {
  let users;
  try {
    users = await User.find().select("employeeId name role");
  } catch (e) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: e.message,
      },
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      message: "all here",
      users,
    },
  });
}

// Create the first user.
export async function createFirstUser(req, res) {
  // Only create user if request provides the default password and no
  // other user exists.
  if (
    (await User.count()) === 0 &&
    req.body.data.passcode === process.env.ADMIN_DEFAULT
  ) {
    process.env.ADMIN_DEFAULT = "";
    const password = await bcrypt.hash(req.body.data.user.password, 8);

    let newUser;
    try {
      newUser = await User.create({
        ...req.body.data.user,
        password,
      });
    } catch (e) {
      return res.status(400).json({
        status: "failure",
        data: {
          message: e.message,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        ...newUser,
      },
    });
  }

  return res.status(401).json({
    status: "failure",
    data: {
      message: "Bad admin password",
    },
  });
}

// Validate user/admin is signed in.
export function isSignedin(req, res) {
  return res.status(200).json({
    status: "success",
    data: {
      message: "You are logged in.",
      employeeId: req.employeeId,
      name: req.name,
    },
  });
}

// Change user color theme.
export async function changeTheme(req, res) {
  // Update color theme.
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        theme: req.body.data.theme,
      },
      { new: true, runValidators: true }
    );
  } catch (e) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: e.message,
      },
    });
  }

  // Set color theme cookie.
  res.cookie("theme", req.body.data.theme);

  return res.status(200).json({
    status: "success",
    data: {
      message: "Theme Updated",
    },
  });
}

// Update user info.
export async function updatedUser(req, res) {
  const updatedUser = {};

  // Check if requried infomation is present.
  if (!req.body?.data || !req.body?.data.employeeId) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: "Please provide user info",
      },
    });
  }

  const payload = req.body.data;

  if (payload.newPassword) {
    const newPassword = await bcrypt.hash(payload.newPassword, 8);
    updatedUser.password = newPassword;
    updatedUser.updatedPassword = Date.now();
  }

  if (payload.name) {
    updatedUser.name = payload.name;
  }

  if (payload.newEmployeeId) {
    updatedUser.employeeId = payload.newEmployeeId;
  }

  // Update user with the given data.
  let user;
  try {
    await User.findOneAndUpdate(
      { employeeId: payload.employeeId },
      updatedUser,
      { runValidators: true }
    );
  } catch (e) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: e.message,
      },
    });
  }

  // Check if current user password was updated.
  if (payload.employeeId === req.user.employeeId && payload?.newPassword) {
    // Create new JSON web token.
    const token = jwt.sign(
      { id: user._id, date: Date.now() },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      message: "Updated user",
    },
  });
}

// Returns two arrays with image urls and the image predictions.
export async function getImagesAndPredictions(req, res) {
  // If the user is an admin, return all image urls and preductions in database.
  if (req.user.role === "admin") {
    let data;
    try {
      data = await User.find().select("images predictions");
    } catch (e) {
      return res.status(400).json({
        status: "failure",
        data: {
          message: e.message,
        },
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        images: data.flatMap((userData) => userData.images),
        predictions: data.flatMap((userData) => userData.predictions),
      },
    });
  }

  // Return only image urls and predictions user made.
  let data;
  try {
    data = await User.findById(req.user._id).select("images predictions");
  } catch (e) {
    return res.status(400).json({
      status: "failure",
      data: {
        message: e.message,
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      images: data.images,
      predictions: data.predictions,
    },
  });
}
