const City = require("../../model/address/cityModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const apiServer = new APIServerHelper(City);

const getAllCities = (req, res) => apiServer.getAll(req, res, ["name"]);

const getCityById = (req, res) => apiServer.getById(req, res);

const createCity = (req, res) => apiServer.createOne(req, res);

const updateCity = (req, res) => apiServer.updateOneById(req, res);

const deleteCity = (req, res) => apiServer.deleteMany(req, res);

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
