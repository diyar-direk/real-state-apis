const PropertyType = require("../../model/property/propertyTypeModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const apiServer = new APIServerHelper(PropertyType);

const getAllTypes = (req, res) => apiServer.getAll(req, res, ["name"]);

const getTypeById = (req, res) => apiServer.getById(req, res);

const createType = (req, res) => apiServer.createOne(req, res);

const updateType = (req, res) => apiServer.updateOneById(req, res);

const deleteType = (req, res) => apiServer.deleteMany(req, res);

module.exports = {
  getAllTypes,
  getTypeById,
  createType,
  updateType,
  deleteType,
};
