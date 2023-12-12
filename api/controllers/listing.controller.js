// controllers/listing.controller.js

import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    // Always set userRef to null, allowing unauthenticated users to post listings
    const userRef = req.body.userRef;

    // Add the userRef to the listing data
    const listingData = {
      ...req.body,
      userRef,
    };

    // Create the listing
    const listing = await Listing.create(listingData);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // Check if the request is authenticated and is the owner
    if (req.isAuthenticated() && req.user.id === listing.userRef) {
      await Listing.findByIdAndDelete(req.params.id);
      return res.status(200).json('Listing has been deleted!');
    }

    // If not authenticated or not the owner, return unauthorized
    return next(errorHandler(401, 'You can only delete your own listings!'));
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    // Check if the request is authenticated and is the owner
    if (req.isAuthenticated() && req.user.id === listing.userRef) {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json(updatedListing);
    }

    // If not authenticated or not the owner, return unauthorized
    return next(errorHandler(401, 'You can only update your own listings!'));
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    // Set Content-Type header to application/json
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

