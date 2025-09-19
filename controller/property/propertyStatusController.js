const PropertyStatus = require("../../model/property/propertyStatusModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const apiServer = new APIServerHelper(PropertyStatus);

const getAllStatus = (req, res) => apiServer.getAll(req, res, ["name"]);

const getStatusById = (req, res) => apiServer.getById(req, res);

const createStatus = (req, res) => apiServer.createOne(req, res);

const updateStatus = (req, res) => apiServer.updateOneById(req, res);

const deleteStatus = (req, res) => apiServer.deleteMany(req, res);

module.exports = {
  getAllStatus,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
};
