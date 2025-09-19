const Region = require("../../model/address/regionModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const apiServer = new APIServerHelper(Region);
const City = require("../../model/address/cityModel");

const getAllRegions = (req, res) =>
  apiServer.getAll(req, res, ["name"], ["cityId"]);

const getRegionById = (req, res) =>
  apiServer.getById(req, res, [{ path: "cityId", select: "name" }]);

const createRegion = async (req, res) => {
  const exstingCity = await City.findById(req.body.cityId);
  if (!exstingCity) return res.status(404).json({ message: "city not found" });
  apiServer.createOne(req, res);
};

const updateRegion = async (req, res) => {
  if (req.body.cityId) {
    const exstingCity = await City.findById(req.body.cityId);
    if (!exstingCity)
      return res.status(404).json({ message: "city not found" });
  }
  apiServer.updateOneById(req, res);
};

const deleteRegion = (req, res) => apiServer.deleteMany(req, res);

module.exports = {
  getAllRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
};
