import mongoose from 'mongoose';
import {app} from './app';

const start = async() => {
    console.log('All is created');
    if(!process.env.JWT_KEY) {
        throw new Error('JWT key must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    try {
        await mongoose.connect(process.env.MONGO_URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    console.log('connected to mongodb');
    } catch (error) {
        console.log(error);
    }
    
} 
start();

app.listen(3000, () => {
    console.log(`Listening on port 3000!!`);
})