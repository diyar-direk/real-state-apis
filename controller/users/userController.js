const User = require("../../model/users/usersModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const apiServer = new APIServerHelper(User);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Contractor = require("../../model/contractor/contractorModel");

const getAllUsers = (req, res) =>
  apiServer.getAll(req, res, ["username"], ["profileId"]);

const getUserById = (req, res) => apiServer.getById(req, res, ["profileId"]);

const deleteUsers = (req, res) => apiServer.deleteMany(req, res);

const register = async (req, res) => {
  try {
    if (req.body.profileId) {
      const existContractor = await Contractor.findById(req.body.profileId);
      if (!existContractor)
        return res.status(404).json({ message: "contractor not found" });
    }
    const passwordBeforeHashed = req.body.password;
    if (passwordBeforeHashed.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    const password = await bcrypt.hash(passwordBeforeHashed, 10);
    const createdBy = req.currentUser._id;
    const newUser = await User.create({ ...req.body, password, createdBy });
    const data = newUser.toObject();
    delete data.password;
    delete data.__v;
    res.status(201).json({ message: "created new item successfully", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  if (req.body.profileId) {
    const existContractor = await Contractor.findById(req.body.profileId);
    if (!existContractor)
      return res.status(404).json({ message: "contractor not found" });
  }
  apiServer.updateOneById(req, res);
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
      .select("+password")
      .populate("profileId")
      .lean();
    if (!user)
      return res.status(400).json({ message: "Wrong username or password" });
    if (!user.isActive)
      return res
        .status(400)
        .json({ message: "you have to activate your acount" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Wrong username or password" });

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        profileId: user.profileId?._id || null,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    delete user.password;
    delete user.__v;

    res.json({ message: `welcome back ${user.username}`, data: user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const data = await User.findById(req.currentUser._id).populate("profileId");
    if (!data) return res.status(404).json({ message: "user not found" });
    if (!data.isActive)
      return res
        .status(400)
        .json({ message: "you have to activate your acount" });
    res.json({ message: `welcome back ${data.username}`, data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUsers,
  register,
  updateUser,
  login,
  getMyProfile,
};
