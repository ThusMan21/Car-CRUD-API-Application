import express from 'express';
import cors from 'cors';
import { cars } from './data.js'; 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


app.get('/api/mostPopularMake', (req, res) => {
  if (cars.length === 0) {
    return res.status(404).json({ message: 'No cars data available' });
  }

  const makeCount = cars.reduce((acc, car) => {
    acc[car.make] = (acc[car.make] || 0) + 1;
    return acc;
  }, {});

  const mostPopularMake = Object.keys(makeCount).reduce((a, b) => makeCount[a] > makeCount[b] ? a : b);
  res.json({ mostPopularMake });
});


app.get('/api/cars', (req, res) => {
  res.json(cars);
});


app.post('/api/cars', (req, res) => {
  const { color, make, model, reg_number } = req.body;

  if (!color || !make || !model || !reg_number) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (cars.some(car => car.reg_number === reg_number)) {
    return res.status(400).json({ message: 'Car with this registration number already exists' });
  }

  cars.push({ color, make, model, reg_number });
  res.status(201).json({ message: 'Car added successfully' });
});


app.delete('/api/cars/:reg_number', (req, res) => {
  const { reg_number } = req.params;

  const initialLength = cars.length;
  const updatedCars = cars.filter(car => car.reg_number !== reg_number);

  if (updatedCars.length === initialLength) {
    return res.status(404).json({ message: 'Car not found' });
  }

  cars.length = 0;
  cars.push(...updatedCars);

  res.json({ message: 'Car deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
