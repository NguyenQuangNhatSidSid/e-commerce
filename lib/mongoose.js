import mongoose from "mongoose";
const mongooseConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(uri);
  }

  //   return mongoose.connect(uri, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
};
export default mongooseConnect;
