const Contractor = require("../../model/contractor/contractorModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const apiServer = new APIServerHelper(Contractor);
const unlinkFile = require("../../utils/unlinkFile");

const getAll = (req, res) =>
  apiServer.getAll(req, res, ["firstName", "middleName", "lastName"]);

const getById = (req, res) => apiServer.getById(req, res);

const addContractor = async (req, res) => {
  const { body, file } = req;

  const profile = file ? file.filename : "";

  if (body.experienceYears)
    body.experienceYears = parseInt(body.experienceYears, 10);

  if (body.links) body.links = JSON.parse(body.links);

  const data = { ...body, profile };

  data.createdBy = req.currentUser?._id;

  try {
    const newData = await Contractor.create(data);
    res
      .status(201)
      .json({ message: "added new contractor successfully", data: newData });
  } catch (error) {
    res.status(400).json({ message: error.message });
    unlinkFile(profile, "profiles");
  }
};

const updateContractor = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;
  const profile = file?.filename || "";

  if (req.currentUser.role === "Contractor")
    if (req.currentUser.profileId !== id) {
      unlinkFile(profile, "profiles");
      return res.status(403).json({ message: "Forbidden" });
    }

  const contractor = await Contractor.findById(id).lean();
  if (!contractor) {
    unlinkFile(profile, "profiles");
    return res.status(404).json({ message: "contractor not found" });
  }
  if (body.experienceYears)
    body.experienceYears = parseInt(body.experienceYears, 10);
  if (body.links) body.links = JSON.parse(body.links);
  const prevProfile = contractor.profile;
  if (profile) body.profile = profile;
  apiServer.updateOneById(
    req,
    res,
    body,
    () => {
      if (file) unlinkFile(prevProfile, "profiles");
    },
    () => unlinkFile(profile, "profiles")
  );
};

const deleteContractor = (req, res) => {
  apiServer.deleteMany(req, res, async (ids) => {
    const contractors = await Contractor.find({
      _id: { $in: ids },
      profile: { $exists: true, $ne: "" },
    }).lean();

    contractors.forEach((contractor) =>
      unlinkFile(contractor.profile, "profiles")
    );
  });
};

module.exports = {
  getAll,
  getById,
  addContractor,
  updateContractor,
  deleteContractor,
};
