const fs   =require('fs')

// const index = fs.readFileSync('index.html','utf-8');
// const data = JSON.parse(fs.readFileSync('data.json','utf-8'));
const users =data.users;
const model = require('../model/property')
const cloudinary = require('../utils/cloudinary');


const Property = model.Property;

//create

exports.createProperty = async (req, res) => {
  console.log(req.files);

  try {
    const uploadedImages = [];

    // Check if any files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

  


    // Assuming req.files is an array, use forEach instead of for...of
    for (const file of req.files.images) {
      console.log(file)
      try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "images"
        });
        uploadedImages.push(result.secure_url);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return res.status(500).json({ message: 'Error uploading images', error: uploadError.message });
      }
    }
    

    if (uploadedImages.length === 0) {
      return res.status(400).json({ message: 'No images uploaded successfully' });
    }

    const property = new Property({
      title: req.body.title,
      type: req.body.type,
      location: req.body.location,
      price: req.body.price,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      squareFootage: req.body.squareFootage,
      description: req.body.description,
      features: req.body.features,
      transactionType:req.body.transactionType,
      agent: {
        name: req.body.agentName,
        phone: req.body.agentPhone,
        email: req.body.agentEmail,
      },
      images: uploadedImages,
      thumbnail: uploadedImages[0], // Set the thumbnail to the first image
    });

    const savedProperty = await property.save();
    console.log(savedProperty);
    res.status(201).json(savedProperty);
    // rest of your code
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property', error: error.message });
  }
};

 
// exports.createUser=(req,res)=>{
//     console.log(req.body);
//     users.push(req.body);
//     res.json(req.body)
//     res.json({type:'POST'})
// }

exports.readProperties=async (req,res)=>{
    try {
        const property = await Property.find();
        res.json(property)
    } catch (error) {
        res.status(400).json({ message: 'Error reading product',error:error.message });
    }
}

exports.readProperty= async (req,res)=>{
    try{
    const id = req.params.id;
    const property = await Property.findById(id);
    res.json(property)
} catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error reading user' });
  }

}


exports.updatePropertyPut=async (req,res)=>{
    const id = req.params.id;
    try {
      const doc = await Property.findOneAndReplace({ _id: id }, req.body, {new:true});
      res.status(201).json(doc);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error replacing user', error });
    }
  };
  
exports.upadatePropertypatch=async (req,res)=>{
    const id = req.params.id;
    try {
      const doc = await Property.findOneAndUpdate({ _id: id }, req.body,{new:true});
      res.status(201).json(doc);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error updating user', error });
    }
  };
  

exports.deleteProperty = async(req,res)=>{
    
    const id = req.params.id;
    try {
      const doc = await Property.findOneAndDelete({ _id: id });
      res.status(201).json(doc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error Deleting product', error });
    }
}