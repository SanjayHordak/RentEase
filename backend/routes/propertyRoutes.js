const express = require('express');
const router = express.Router();

const{createProperty,getAllProperties,getPropertyById,updateProperty,deleteProperty,togglePropertyStatus} = require('../controllers/propertyController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// GET /api/v1/properties 
// Retrieve all properties owned by authenticated user
router.get('/',verifyFirebaseToken,getAllProperties);

// POST /api/v1/properties
//Create a new Property
router.post('/',verifyFirebaseToken,createProperty);

//GET /api/v1/properties/:id
//Retrieve a single property by ID
router.get('/:id',verifyFirebaseToken,getPropertyById);

// PUT /api/v1/properties/:id 
// Update a property
router.put('/:id',verifyFirebaseToken,updateProperty);

// PATCH /api/v1/properties/:id/status
// Activate / deactivate 
router.patch( '/:id/status', verifyFirebaseToken, togglePropertyStatus );

// DELETE /api/v1/properties/:id 
// Delete a property
router.delete('/:id',verifyFirebaseToken,deleteProperty);

module.exports = router;