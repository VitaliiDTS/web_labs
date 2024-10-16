import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Stadium from './models/stadiumModel.mjs';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://DataBaseUser:Vitalik%3AD777@cluster0.qoj33.mongodb.net/stadiums?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Failed to connect to MongoDB Atlas:', err));

app.get('/stadiums', async (req, res) => {
    try {
        const stadiumData = await Stadium.find();
        res.json(stadiumData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stadiums', error });
    }
});

app.get('/stadiums/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const stadium = await Stadium.findById(id);
        if (!stadium) {
            return res.status(404).json({ message: 'Stadium not found' });
        }
        res.json(stadium);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stadium', error });
    }
});

app.post('/stadiums/bulk', async (req, res) => {
    try {
        const stadiums = req.body.stadiums.map(async (stadium) => {
            if (!stadium.id) {
                const lastStadium = await Stadium.findOne().sort({ id: -1 });
                stadium.id = (lastStadium && lastStadium.id) ? lastStadium.id + 1 : 1;
            }
            return stadium;
        });

        const stadiumsWithId = await Promise.all(stadiums);
        const result = await Stadium.insertMany(stadiumsWithId);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding stadiums:', error);
        res.status(500).json({ message: 'Error adding stadiums', error });
    }
});

app.delete('/stadiums/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Stadium.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Stadium not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting stadium:', error);
        res.status(500).json({ message: 'Error deleting stadium', error });
    }
});

app.put('/stadiums/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const result = await Stadium.findByIdAndUpdate(id, updatedData, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Stadium not found' });
        }
        res.json(result);
    } catch (error) {
        console.error('Error updating stadium:', error);
        res.status(500).json({ message: 'Error updating stadium', error });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
