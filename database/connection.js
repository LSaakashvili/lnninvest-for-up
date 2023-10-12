const mongoose = require("mongoose");

const DBConnection = async() => {
    const uri = "mongodb+srv://amdgarigia:Luka2015@cluster0.y8vtu4p.mongodb.net/lnninvest?retryWrites=true&w=majority";
    try {
        // Connect to the MongoDB cluster
         mongoose.connect(
          uri,
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => console.log(" Mongoose is connected")
        );
    
      } catch (e) {
        console.log("could not connect" + " " + e);
    }
}

module.exports = DBConnection;