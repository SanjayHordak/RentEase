const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    ownerUid:{
        type:String,
        required:true,
        index:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        street:{type:String,required:true,trim:true},
        area:{type:String,required:true,trim:true},
        city:{type:String,required:true,trim:true},
        state:{type:String,required:true,trim:true},
        pincode:{type:String,required:true,trim:true}
    },
    type:{
        type:String,
        enum:['Apartment','Hostel'],
        required:true
    },
    //Apartment specific
    bhkConfig:{
        type:String,
        enum:['Studio','1 BHK','2 BHK','3 BHK'],
        default:null
    },
    //Hostel Specific
    hostelDetails:{
        rooms:[{
            roomType:{
                type:String,
                enum:['1 Bed','2 Bed','3 Bed','4 Bed'],
                required:true
            },
            count:{
                type:Number,
                required:true
            },
            rentPerBed:{
                type:Number,
                required:true
            },
            securityDeposit:{
                type:Number,
                required:true
            }
        }]
    },
    monthlyRent:{
        type:Number,
        required:function() { return this.type === 'Apartment'; },
        min:0
    },
    securityDeposit:{
        type:Number,
        required:function() { return this.type === 'Apartment'; },
        min:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});
module.exports = mongoose.model('Property',propertySchema);