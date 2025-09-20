const PropertyImage = require("../../model/property/PropertyImagesModel");
const Property = require("../../model/property/propertyModel");
const APIServerHelper = require("../../utils/apiServerHelper");
const unlinkFile = require("../../utils/unlinkFile");
const apiServer = new APIServerHelper(PropertyImage);

const imageById = (req, res) => apiServer.getById(req, res, [], true);

const allImages = (req, res) => apiServer.getAll(req, res, [], [], true);

const deleteImages = (req, res) =>
  apiServer.deleteMany(req, res, async (ids) => {
    const images = await PropertyImage.find({ _id: { $in: ids } }).select(
      "src"
    );
    images.forEach((img) => unlinkFile(img.src, "property"));
  });

const addPropertyImage = async (req, res) => {
  const { propertyId } = req.body;
  const { files } = req;
  const images = files || [];

  if (!propertyId) {
    images.forEach((img) => unlinkFile(img.filename, "property"));
    return res.status(400).json({ message: "you must to select property id" });
  }

  try {
    const property = await Property.findById(propertyId)
      .select("_id")
      .populate("images")
      .lean();
    if (!property) {
      images.forEach((img) => unlinkFile(img.filename, "property"));
      return res.status(404).json({ message: "property noy found" });
    }

    const imagesLength = images.length + property.images.length;

    if (imagesLength > 5) {
      images.forEach((img) => unlinkFile(img.filename, "property"));
      return res
        .status(400)
        .json({ message: "you can not select more then 5 images" });
    }

    const newImages = await Promise.all(
      images.map((img) =>
        PropertyImage.create({
          src: img.filename,
          propertyId,
        })
      )
    );

    return res.status(201).json({
      message: `new images created successfully`,
      data: newImages,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    images.forEach((img) => unlinkFile(img.filename, "property"));
  }
};

module.exports = { imageById, allImages, deleteImages, addPropertyImage };
