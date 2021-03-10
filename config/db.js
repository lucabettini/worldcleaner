import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.error(`Error: ${error.message}.`.red.underline.bold);
    // Exit with failure
    process.exit(1);
  }
};

export default connectDB;
