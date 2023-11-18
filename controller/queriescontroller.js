const  model = require('../model/queries');
const nodemailer = require('nodemailer');

// const  = require('../model/user')

const Queries = model.Queries;

// Create a new query
exports.createQuery = async (req, res) => {
  try {
    const newQuery = new Queries(
        {
            name:req.body.name,
            qemail:req.body.qemail,
            userType:req.body.userType,
            phoneNo:req.body.phoneNo,
            message:req.body.message,
            resolved:false,
       } );
    const savedQuery = await newQuery.save();
    await sendQueryEmail(req.body.qemail,req.body.name);
    res.status(201).json(savedQuery);
  } catch (error) {
    res.status(500).json({ message: 'Error creating query', error: error.message });
  }
};

// Function to send verification email
const sendQueryEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: 'noreply@realtyprop.in',
      to: email, // Assuming 'email' is the recipient's email address
      subject: 'Your Query Has Been Submitted - RealtyProp.in',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6rem;">
            <p>Dear ${name},</p>
    
            <p>Thank you for reaching out to us. Your query has been successfully submitted, and we appreciate your interest in our services/products.Our dedicated team is working diligently to address your query. We strive to provide prompt and accurate assistance to all our users.Rest assured, one of our team members will contact you shortly to discuss your query in detail and provide the necessary assistance.</p>
    
            <p>If you have any further questions or need immediate assistance, please feel free to contact us.</p>
    
            <p>Thank you for choosing  <a href="https://realtyprop.in" style=" color: #4E5D94;  text-decoration: none;  cursor: pointer;"><b>realtyprop.in</b></a> . We look forward to assisting you soon!</p>
    
            <p>Best Regards,<br/>
            team realtyprop.in<br/>
            </p>
          </body>
        </html>
      `
    };
    

  await transporter.sendMail(mailOptions);
};



// Get all queries
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Queries.find().sort({ date: 'asc' }); // Fetch queries in ascending order of date
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error getting queries', error: error.message });
  }
};

// Get query by ID
exports.getQueryById = async (req, res) => {
  try {
    const query = await Queries.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.json(query);
  } catch (error) {
    res.status(500).json({ message: 'Error getting query', error: error.message });
  }
};

exports.updateQueryByIdPut=async (req,res)=>{
    const id = req.params.id;
    try {
      const doc = await Queries.findOneAndReplace({ _id: id }, req.body, {new:true});
      res.status(201).json(doc);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error replacing Query', error });
    }
  };


// Update query by ID
exports.updateQueryById = async (req, res) => {
    console.log(req.body)
  try {
    const updatedQuery = await Queries.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedQuery) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.json(updatedQuery);
  } catch (error) {
    res.status(500).json({ message: 'Error updating query', error: error.message });
  }
};

// Delete query by ID
exports.deleteQueryById = async (req, res) => {
  try {
    const deletedQuery = await Queries.findByIdAndDelete(req.params.id);
    if (!deletedQuery) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.json(deletedQuery);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting query', error: error.message });
  }
};
