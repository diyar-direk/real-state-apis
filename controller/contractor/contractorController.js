const Contractor = require("../../model/contractor/contractorModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const parsedQueryHelper = require("../../utils/parsedQueryHelper");
const apiServer = new APIServerHelper(Contractor);
const unlinkFile = require("../../utils/unlinkFile");

const getAll = async (req, res) => {
  try {
    const parsedQuery = parsedQueryHelper(
      req.query,
      "isActive",
      "includeUnlinked"
    );
    const {
      search,
      page = 1,
      limit = 10,
      sort,
      isActive,
      includeUnlinked = false,
    } = req.query;

    if (search) {
      parsedQuery.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { middleName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    let sortStage = {};
    if (sort) {
      const fields = sort.split(",");
      fields.forEach((fieldRaw) => {
        const field = fieldRaw.trim();
        if (!field) return;
        if (field.startsWith("-")) sortStage[field.substring(1)] = -1;
        else sortStage[field] = 1;
      });
    } else {
      sortStage = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const includeUnlinkedFlag = JSON.parse(includeUnlinked);

    const postLookupConditions = [];

    if (includeUnlinkedFlag) {
      postLookupConditions.push({
        $or: [{ user: { $exists: false } }, { "user.role": "Contractor" }],
      });
    } else {
      postLookupConditions.push({ "user.role": "Contractor" });
    }

    if (isActive === "true") {
      if (includeUnlinkedFlag) {
        postLookupConditions.push({
          $or: [{ "user.isActive": true }, { user: { $exists: false } }],
        });
      } else {
        postLookupConditions.push({ "user.isActive": true });
      }
    } else if (isActive === "false") {
      if (includeUnlinkedFlag) {
        postLookupConditions.push({
          $or: [{ "user.isActive": false }, { user: { $exists: false } }],
        });
      } else {
        postLookupConditions.push({ "user.isActive": false });
      }
    }

    const finalPostLookupMatch =
      postLookupConditions.length > 0 ? { $and: postLookupConditions } : {};

    const contractors = await Contractor.aggregate([
      { $match: parsedQuery },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "profileId",
          as: "user",
        },
      },

      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      ...(Object.keys(finalPostLookupMatch).length
        ? [{ $match: finalPostLookupMatch }]
        : []),
      { $sort: sortStage },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $project: {
          "user.password": 0,
          "user.role": 0,
          "user.profileId": 0,
          "user.createdAt": 0,
          "user.updatedAt": 0,
          "user.__v": 0,
        },
      },
    ]);

    const totalCountAgg = [
      { $match: parsedQuery },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "profileId",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      ...(Object.keys(finalPostLookupMatch).length
        ? [{ $match: finalPostLookupMatch }]
        : []),
      { $count: "total" },
    ];

    const totalCount = await Contractor.aggregate(totalCountAgg);
    const total = totalCount[0]?.total || 0;

    res.json({
      results: contractors.length,
      totalCount: total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: contractors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

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
