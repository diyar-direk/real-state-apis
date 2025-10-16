const Property = require("../../model/property/propertyModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const apiServer = new APIServerHelper(Property);
const PropertyImage = require("../../model/property/PropertyImagesModel");
const unlinkFile = require("../../utils/unlinkFile");

const getAllProperties = (req, res) =>
  apiServer.getAll(
    req,
    res,
    ["title", "description"],
    [
      { path: "type", select: "name" },
      { path: "status", select: "name" },
      { path: "city", select: "name" },
      { path: "region", select: "name" },
      { path: "contractorId", select: "firstName" },
    ]
  );

const propertyById = (req, res) =>
  apiServer.getById(req, res, [
    { path: "type", select: "name" },
    { path: "status", select: "name" },
    { path: "city", select: "name" },
    { path: "region", select: "name" },
    { path: "contractorId", select: "firstName" },
    { path: "images", select: "src" },
  ]);

const addProperty = async (req, res) => {
  const { body, files } = req;
  const images = files?.images || [];

  const coverImage = files?.coverImage?.[0]?.filename || null;

  if (images.length > 5)
    return res
      .status(400)
      .json({ message: "you can not select more then 5 images" });
  apiServer.createOne(
    req,
    res,
    { ...body, coverImage },
    async ({ data }) => {
      const propertyImages = await Promise.all(
        images.map((img) =>
          PropertyImage.create({ src: img.filename, propertyId: data._id })
        )
      );
      return { data, images: propertyImages };
    },
    () => {
      images.map((src) => unlinkFile(src.filename, "property"));
      unlinkFile(coverImage, "property");
    }
  );
};

const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { body, files } = req;
  const newCoverImage = files?.coverImage?.[0]?.filename || null;

  const checkProperty = await Property.findById(id)
    .populate({
      path: "images",
      select: "_id",
    })
    .select("coverImage");

  if (!checkProperty)
    return res.status(404).json({ message: "property not found" });
  if (newCoverImage) body.coverImage = newCoverImage;

  const newImages = files.images || [];
  const imagesLength = newImages?.length + checkProperty.images.length;

  if (imagesLength > 5) {
    newImages?.map((img) => unlinkFile(img.filename, "property"));
    unlinkFile(newCoverImage, "property");
    return res
      .status(400)
      .json({ message: "you can not select more then 5 images" });
  }

  try {
    const updatedData = await Property.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    newCoverImage && unlinkFile(checkProperty.coverImage, "property");

    const images = await Promise.all(
      newImages?.map((img) =>
        PropertyImage.create({ src: img.filename, propertyId: id })
      )
    );

    const data = updatedData.toObject();

    data.images = [...checkProperty.images, ...images];

    res.json({ message: "updated successfully", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
    unlinkFile(newCoverImage, "property");
    newImages?.map((img) => unlinkFile(img.filename, "property"));
  }
};

const deleteProperty = async (req, res) =>
  apiServer.deleteMany(req, res, async (ids) => {
    const images = await PropertyImage.find({
      propertyId: { $in: ids },
    })
      .select("src")
      .lean();

    const properties = await Property.find({ _id: { $in: ids } })
      .select("coverImage")
      .lean();

    properties.forEach((p) => unlinkFile(p.coverImage, "property"));
    images.forEach((img) => unlinkFile(img.src, "property"));
    await PropertyImage.deleteMany({ propertyId: { $in: ids } });
  });

module.exports = {
  getAllProperties,
  addProperty,
  propertyById,
  updateProperty,
  deleteProperty,
};
