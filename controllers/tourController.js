const mongoose = require("mongoose");
const tourModel = require("../models/tourModel.js");

const createTour = async (req, res) => {
  try {
    const parsedImage = JSON.stringify(req.body.imageFile);

    // req.userId coming from authentication middleware

    const newTour = await tourModel.create({ ...req.body, creator: req.userId, imageFile: parsedImage });
    res.status(201).json({
      status: "success",
      data: newTour,
    });
  } catch (error) {
    res.status(404).json({
      status: error.message,
      message: "Tour creation failed",
    });
  }
};

const getTour = async (req, res) => {
  try {
    console.log("inside pagination API");
    const page = +req.query.page;
    const limit = 5;
    const startIndex = (page - 1) * limit;
    const totalTours = await tourModel.countDocuments({});
    const tours = await tourModel.find().limit(limit).skip(startIndex);
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
      currentPage: page,
      totalTours: totalTours,
      noOfPages: Math.ceil(totalTours / limit),
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Fetching tours failed",
    });
  }
};
const getSingleTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await tourModel.findById(id);
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Fetching tours failed",
    });
  }
};

const getToursByUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: "Fail",
        message: "Fetching user based tours got failed",
      });
    }

    const userTours = await tourModel.find({ creator: id });
    res.status(200).json({
      status: "success",
      data: userTours,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: "Fail",
        message: "No tour exists with this id",
      });
    }

    await tourModel.findByIdAndRemove(id);
    res.status(200).json({
      message: "Deleted tour successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
const updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    const { imageFile, title, description, tags, creator } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: "Fail",
        message: "No tour exists with this id",
      });
    }

    const updatedTour = {
      title,
      description,
      imageFile,
      tags,
      creator,
      _id: id,
    };
    await tourModel.findByIdAndUpdate(id, updatedTour, { new: true });
    res.status(200).json({
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

const getTourBySearch = async (req, res) => {
  const title = new RegExp(req.query.title, "i");
  try {
    const tours = await tourModel.find({ title });
    return res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
const getTourByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const tours = await tourModel.find({ tags: { $in: tag } });
    return res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
const getRelatedToursByTag = async (req, res) => {
  const tags = req.body;
  try {
    const tours = await tourModel.find({ tags: { $in: tags } });
    return res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const updateLikeTour = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(typeof req.userId);

    if (!req.userId) {
      return res.json({
        message: "user not authenticated",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: "Fail",
        message: "Not a valid tour",
      });
    }

    const Tours = await tourModel.findById(id);

    // console.log(req.userId.toString());

    const likedUserIndex = Tours.likes.findIndex((likedUserId) => likedUserId === req.userId.toString());
    if (likedUserIndex === -1) {
      Tours.likes.push(req.userId);
    } else {
      Tours.likes = Tours.likes.filter((likedUserId) => likedUserId !== req.userId.toString());
    }

    const updatedTour = await tourModel.findByIdAndUpdate(id, Tours, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: updatedTour,
    });
  } catch (error) {
    return res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};

module.exports = {
  createTour,
  getTour,
  getSingleTour,
  getToursByUser,
  deleteTour,
  updateTour,
  getTourBySearch,
  getTourByTag,
  getRelatedToursByTag,
  updateLikeTour,
};
