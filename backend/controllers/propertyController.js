const mongoose = require('mongoose');
const Property = require('../models/Properties');

// Create Property
const createProperty = async (req, res) => {
  try {
    const ownerUid = req.user.uid;

    const {
      name,
      address,
      type,
      bhkConfig,
      hostelDetails,
      monthlyRent,
      securityDeposit,
    } = req.body;

    // Property name validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Property name is required',
      });
    }

    // Address validation
    if (!address) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Property address is required',
      });
    }

    const requiredAddressFields = [
      'street',
      'area',
      'city',
      'state',
      'pincode',
    ];

    for (const field of requiredAddressFields) {
      if (
        !address[field] ||
        typeof address[field] !== 'string' ||
        !address[field].trim()
      ) {
        return res.status(400).json({
          success: false,
          data: null,
          error: `${field} is required.`,
        });
      }
    }

    // Property type validation
    if (!type || !['Apartment', 'Hostel'].includes(type)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Property type must be Apartment or Hostel',
      });
    }

    // Apartment validation
    if (type === 'Apartment') {
      const allowedBhk = [
        'Studio',
        '1 BHK',
        '2 BHK',
        '3 BHK',
      ];

      if (!bhkConfig || !allowedBhk.includes(bhkConfig)) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Valid BHK configuration is required for Apartment',
        });
      }

      // Monthly rent validation
      if (
        monthlyRent === undefined ||
        monthlyRent === null ||
        Number.isNaN(Number(monthlyRent)) ||
        Number(monthlyRent) < 0
      ) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Monthly rent is required and cannot be negative for Apartment',
        });
      }

      // Security deposit validation
      if (
        securityDeposit === undefined ||
        securityDeposit === null ||
        Number.isNaN(Number(securityDeposit)) ||
        Number(securityDeposit) < 0
      ) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Security deposit is required and cannot be negative for Apartment',
        });
      }
    }

    // Hostel validation
    if (type === 'Hostel') {
      if (!hostelDetails || !hostelDetails.rooms || !Array.isArray(hostelDetails.rooms) || hostelDetails.rooms.length === 0) {
        return res.status(400).json({
          success: false,
          data: null,
          error: 'Hostel details with at least one room type are required',
        });
      }

      const allowedRoomTypes = ['1 Bed', '2 Bed', '3 Bed', '4 Bed'];

      for (const room of hostelDetails.rooms) {
        if (!room.roomType || !allowedRoomTypes.includes(room.roomType)) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Valid room type is required for Hostel rooms',
          });
        }
        if (room.count === undefined || room.count === null || Number(room.count) <= 0) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Room count must be greater than 0',
          });
        }
        if (room.rentPerBed === undefined || room.rentPerBed === null || Number(room.rentPerBed) < 0) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Rent per bed cannot be negative',
          });
        }
        if (room.securityDeposit === undefined || room.securityDeposit === null || Number(room.securityDeposit) < 0) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Security deposit per bed cannot be negative',
          });
        }
      }
    }

    // Prepare property data
    const propertyData = {
      ownerUid,
      name: name.trim(),

      address: {
        street: address.street.trim(),
        area: address.area.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      },

      type,
      isActive: true,
    };

    // Apartment data
    if (type === 'Apartment') {
      propertyData.bhkConfig = bhkConfig;
      propertyData.monthlyRent = Number(monthlyRent);
      propertyData.securityDeposit = Number(securityDeposit);
    }

    // Hostel data
    if (type === 'Hostel') {
      propertyData.hostelDetails = {
        rooms: hostelDetails.rooms.map(r => ({
          roomType: r.roomType,
          count: Number(r.count),
          rentPerBed: Number(r.rentPerBed),
          securityDeposit: Number(r.securityDeposit),
        }))
      };
    }

    // Create property
    const property = await Property.create(propertyData);

    return res.status(201).json({
      success: true,
      data: property,
      message: 'Property Created Successfully',
    });
  } catch (error) {
    console.error('Create Property Error:', error);

    return res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to create property',
    });
  }
};


// Get All Properties
const getAllProperties = async (req, res) => {
  try {
    const ownerUid = req.user.uid;

    const properties = await Property.find({
      ownerUid,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: properties,
      message: 'All properties fetched successfully',
    });
  } catch (error) {
    console.error('Get All Properties Error:', error);

    return res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to get all properties',
    });
  }
};


// Get Property By ID
const getPropertyById = async (req, res) => {
  try {
    const ownerUid = req.user.uid;
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Invalid Property ID',
      });
    }

    const property = await Property.findOne({
      _id: id,
      ownerUid,
      isActive: true,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Property not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
      error: null,
    });
  } catch (error) {
    console.error('Get Property By ID Error:', error);

    return res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to get property by id',
    });
  }
};

//update Property
const updateProperty = async(req,res) =>{
  try{
   const ownerUid = req.user.uid;
   const {id} = req.params;
   //validate mongodb object id
   if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({success:false,data:null,error:'Invalid property id'});
   }
   //Find property belonging to the logged-in user
   const property = await Property.findOne({_id:id,ownerUid,isActive:true});
   if(!property){
    return res.status(400).json({success:false,data:null,error:'Property not found'});
   }
   //Extract fields to fill
   const {
    name,
    address,
    type,
    monthlyRent,
    securityDeposit,
    bhkConfig,
    hostelDetails,
    photoUrls
   } = req.body;
   //property name
   if(name !==undefined){
    if(!name.trim()){
      return res.status(400).json({success:false,data:null,error:'Property name is required'});
    }
    property.name = name.trim();
   }
   //Address
   if(address !== undefined){
    const requiredAddressFields = [
      'street',
      'area',
      'city',
      'state',
      'pincode'
    ];
    for(const field of requiredAddressFields){
      if(address[field] === undefined || !String(address[field]).trim()){
        return res.status(400).json({
          success:false,
          data:null,
          error:`${field} is required`,
        });
      }
    }
    property.address = {
      street:address.street.trim(),
      area:address.area.trim(),
      city:address.city.trim(),
      state:address.state.trim(),
      pincode:address.pincode.trim(),
    };
   }
   //Property type
   if(type !== undefined){
    if(!['Apartment','Hostel'].includes(type)){
      return res.status(400).json({
        success:false,
        data:null,
        error:'Invalid property type',
      });
    }
    property.type = type;
   }
   //Validate final property type
   if(property.type === 'Apartment'){
    const allowedBhk = ['Studio','1 BHK','2 BHK','3 BHK'];
    const finalBhk = bhkConfig !== undefined ? bhkConfig : property.bhkConfig;
    if(finalBhk !== undefined && !allowedBhk.includes(finalBhk)){
      return res.status(400).json({
        success:false,
        data:null,
        error:'Invalid BHK configuration',
      });
    }
    property.bhkConfig = finalBhk;
    property.hostelDetails = undefined;
   }
   //Hostel
   if(property.type === 'Hostel'){
    if(hostelDetails !== undefined) {
      if(!hostelDetails.rooms || !Array.isArray(hostelDetails.rooms) || hostelDetails.rooms.length === 0){
        return res.status(400).json({
          success:false,
          data:null,
          error:'Hostel details with at least one room type are required',
        });
      }
      const allowedRoomTypes = ['1 Bed','2 Bed','3 Bed','4 Bed'];
      for (const room of hostelDetails.rooms) {
        if (!room.roomType || !allowedRoomTypes.includes(room.roomType)) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Valid room type is required for Hostel rooms',
          });
        }
        if (room.count === undefined || room.count === null || Number(room.count) <= 0) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Room count must be greater than 0',
          });
        }
        if (room.rentPerBed === undefined || room.rentPerBed === null || Number(room.rentPerBed) < 0) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Rent per bed cannot be negative',
          });
        }
        if (room.securityDeposit === undefined || room.securityDeposit === null || Number(room.securityDeposit) < 0) {
          return res.status(400).json({
            success: false,
            data: null,
            error: 'Security deposit per bed cannot be negative',
          });
        }
      }
      property.hostelDetails = {
        rooms: hostelDetails.rooms.map(r => ({
          roomType: r.roomType,
          count: Number(r.count),
          rentPerBed: Number(r.rentPerBed),
          securityDeposit: Number(r.securityDeposit),
        }))
      };
    }
    property.bhkConfig = undefined;
   }
   //Monthly Rent (Only for Apartment)
   if(property.type === 'Apartment' && monthlyRent !== undefined){
    if(Number(monthlyRent) < 0){
      return res.status(400).json({
        success:false,
        data:null,
        error:'Monthly rent cannot be negative',
      });
    }
    property.monthlyRent = Number(monthlyRent);
   }
   //Security Deposit (Only for Apartment)
   if(property.type === 'Apartment' && securityDeposit !== undefined){
    if(Number(securityDeposit) < 0){
      return res.status(400).json({
        success:false,
        data:null,
        error:'Security deposit cannot be negative',
      });
    }
    property.securityDeposit = Number(securityDeposit);
   }
   //Save changes
   await property.save();
   return res.status(200).json({
    success:true,
    data:property,
    message:'Property updated successfully',
   });
  }
  catch(error){

    return res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to get property by id',
    });
  }
};

/** * TOGGLE PROPERTY STATUS
* PATCH /api/v1/properties/:id/status * 
* Activates or deactivates a property. 
*/ 
const togglePropertyStatus = async (req, res) => {
   try {
     const ownerUid = req.user.uid;
      const {id} = req.params;
       const {isActive} = req.body;
  // Validate MongoDB ObjectId
 if (!mongoose.Types.ObjectId.isValid(id)) {
   return res.status(400).json({ success: false, data: null, error: 'Invalid property ID', });
  } 
// Validate isActive
 if (typeof isActive !== 'boolean') {
   return res.status(400).json({ success: false, data: null, error: 'isActive must be true or false', });
   }
  const property = await Property.findOneAndUpdate( { _id: id, ownerUid, }, { $set: { isActive, }, }, { new: true, runValidators: true, } );
   if (!property) { 
    return res.status(404).json({ success: false, data: null, error: 'Property not found', });
   }
    return res.status(200).json({ success: true, data: property, error: null, message: isActive ? 'Property activated successfully' : 'Property deactivated successfully', });
   }
    catch (error) { 
      console.error('Toggle property status error:', error);
       return res.status(500).json({ success: false, data: null, error: 'Failed to update property status', });
       } 
      };
      
/** DELETE PROPERTY 
 DELETE /api/v1/properties/:id 
 Permanently deletes the property from MongoDB.
 */
 const deleteProperty = async (req, res) => {
   try {
     const ownerUid = req.user.uid;
      const {id} = req.params;
// Validate MongoDB ObjectId
 if (!mongoose.Types.ObjectId.isValid(id)) {
   return res.status(400).json({ success: false, data: null, error: 'Invalid property ID', });
   }
// Only the owner can permanently delete their property
 const property = await Property.findOneAndDelete({ _id: id, ownerUid, });
  if (!property) {
     return res.status(404).json({ success: false, data: null, error: 'Property not found', });
  } 
   return res.status(200).json({ success: true, data: null, error: null, message: 'Property deleted permanently', }); 

  }
   catch (error) {
     console.error('Delete property error:', error);
      return res.status(500).json({ success: false, data: null, error: 'Failed to delete property', }); 
    }
   };


module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  togglePropertyStatus
};