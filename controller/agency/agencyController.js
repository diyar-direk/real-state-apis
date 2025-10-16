const Agency = require("../../model/agency/agencyModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const unlinkFile = require("../../utils/unlinkFile");
const apiServer = new APIServerHelper(Agency);

const allAgency = (req, res) =>
  apiServer.getAll(
    req,
    res,
    ["name", "description"],
    [
      { path: "city", select: "name" },
      { path: "region", select: "name" },
      { path: "contractors", select: "firstName lastName" },
    ]
  );

const agencyById = (req, res) =>
  apiServer.getById(req, res, [
    { path: "city", select: "name" },
    { path: "region", select: "name" },
    { path: "contractors", select: "firstName lastName" },
  ]);

const createAgency = async (req, res) => {
  const { file, body } = req;
  const logo = file?.filename || "";
  body.logo = logo;
  apiServer.createOne(
    req,
    res,
    body,
    () => {},
    () => unlinkFile(logo, "agency")
  );
};

const deleteAgency = (req, res) => {
  apiServer.deleteMany(req, res, async (ids) => {
    const agencies = await Agency.find({
      _id: { $in: ids },
      logo: { $exists: true, $ne: "" },
    }).lean();

    agencies.forEach((agency) => unlinkFile(agency.logo, "agency"));
  });
};

const deleteAgencyById = async (req, res) => {
  const { id } = req.params;
  try {
    const agency = await Agency.findById(id).lean();
    if (!agency) return res.status(404).json({ message: "agency not found" });

    if (req.currentUser.role !== "Admin")
      if (
        !agency.contractors.some(
          (c) => c.toString() === req.currentUser.profileId
        )
      )
        return res.status(403).json({ message: "Forbidden" });

    await Agency.findByIdAndDelete(id);

    unlinkFile(agency.logo, "agency");
    res.json({ message: "deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAgency = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;
  const newLogo = file?.filename || "";

  try {
    const agency = await Agency.findById(id).lean();

    if (!agency) return res.status(404).json({ message: "agency not found" });

    if (req.currentUser.role !== "Admin") {
      delete body.contractors;
      if (
        !agency.contractors.some(
          (c) => c.toString() === req.currentUser.profileId
        )
      ) {
        unlinkFile(newLogo, "agency");
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (body.contractors) body.contractors = JSON.parse(body.contractors);

    if (newLogo) body.logo = newLogo;

    const data = await Agency.findByIdAndUpdate(id, body, {
      runValidators: true,
      new: true,
    });
    if (newLogo) unlinkFile(agency.logo, "agency");

    res.json({ message: "updated successfully", data });
  } catch (error) {
    unlinkFile(newLogo, "agency");
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  allAgency,
  agencyById,
  createAgency,
  deleteAgency,
  deleteAgencyById,
  updateAgency,
};
