const Contractor = require("../../model/contractor/contractorModel");
const Property = require("../../model/property/propertyModel");
const Agency = require("../../model/agency/agencyModel");
const APIFeatures = require("../../utils/apiFeatures");

const arrayOfQueries = [
  { key: "contractors", model: Contractor, fields: ["firstName", "lastName"] },
  { key: "properties", model: Property, fields: ["title", "description"] },
  { key: "agencies", model: Agency, fields: ["name", "description"] },
];

const getHomeContent = async (req, res) => {
  try {
    let data = {};

    if (req.query.search) {
      const query = req.query.search;
      const tokens = query.split(" ").map((word) => new RegExp(word, "i"));

      const results = await Promise.all(
        arrayOfQueries.map(async ({ key, model, fields }) => {
          const searchConditions = tokens.map((token) => ({
            $or: fields.map((field) => ({ [field]: token })),
          }));

          const baseQuery = model.find({ $and: searchConditions }).lean();

          const features = new APIFeatures(baseQuery, req.query)
            .sort()
            .fields()
            .paginate()
            .filter();

          const [results, totalCount] = await Promise.all([
            features.query,
            model.countDocuments({ $and: searchConditions }),
          ]);

          return { key, results, totalCount };
        })
      );

      data = results.reduce((acc, item) => {
        acc[item.key] = {
          results: item.results,
          totalCount: item.totalCount,
        };
        return acc;
      }, {});
    } else {
      const results = await Promise.all(
        arrayOfQueries.map(async ({ key, model }) => {
          const features = new APIFeatures(model.find().lean(), req.query)
            .paginate()
            .filter()
            .sort()
            .fields();

          const data = await features.query;
          return { key, data };
        })
      );

      data = results.reduce((acc, item) => {
        acc[item.key] = item.data;
        return acc;
      }, {});
    }

    res.json({
      message: "operation done successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getHomeContent };
