import mongoose from "mongoose"


const MONGO_URI = process.env.MONGO_URI as string

if (!MONGO_URI) {
    throw new Error("please add MONGO_URI in your .env")
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { connection: null, promise: null }
}

export async function connToDb() {
    if (cached.connection) {
        return cached.connection
    }
    if (!cached.connection) {
        cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: true }).then((mongoose) => mongoose.connection)
    }
    try {
        cached.connection = await cached.promise

    } catch (error) {
        cached.promise = null;
        throw error
    }
    return cached.connection
}