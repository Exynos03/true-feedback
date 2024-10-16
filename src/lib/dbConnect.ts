import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

const dbConnect = async(): Promise<void>  => {
    if(connection.isConnected) {
        console.log('Database is already connected')
        return
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        
        connection.isConnected = db.connection[0].readyState

        console.log("Db connected successfully")
    } catch (error) {
        console.log("DB connectin failed => ", error)
        process.exit()
    }
}

export  default dbConnect;

