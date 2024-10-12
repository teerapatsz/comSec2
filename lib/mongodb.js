import mongoose from 'mongoose'

export const connectMongoDB = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Check the connection
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function() {
            console.log("MongoDB connection is open");
        });

    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
}