import mongoose from 'mongoose';

const stadiumSchema = new mongoose.Schema({
    id: { type: Number, required: false, unique: true },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    viewers: { type: Number, required: true },
    image: { type: String, required: true }
});

const Stadium = mongoose.model('Stadium', stadiumSchema);
export default Stadium;
