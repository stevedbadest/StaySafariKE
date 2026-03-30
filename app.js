const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Important for the Admin form

let listings = [
    { id: 1, type: 'Stay', name: 'Malindi Marine Villa', loc: 'Casuarina, Malindi', price: 12500, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', rating: 4.8, desc: '4-bedroom villa with private pool.', amenities: ['wifi', 'swimming-pool'], reviews: [] },
    { id: 2, type: 'Car', name: 'Toyota Prado (Silver)', loc: 'Malindi Airport', price: 9000, img: 'https://www.gat-sales.com/wp-content/uploads/2016/11/2017-Toyota-Prado.jpg', rating: 5.0, desc: '4WD Diesel Automatic.', amenities: ['snowflake', 'gas-pump'], reviews: [] },
    { id: 3, type: 'Stay', name: 'Ocean Breeze Apartment', loc: 'Silversands, Malindi', price: 8000, img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', rating: 4.7, desc: 'Modern 2-bedroom with sea view.', amenities: ['wifi', 'tv'], reviews: [] },
    { id: 4, type: 'Car', name: 'Toyota Harrier (White)', loc: 'Malindi Town', price: 8500, img: 'https://kai-and-karo.ams3.cdn.digitaloceanspaces.com/media/vehicles/images/1216e379bdc149fcacbbbb7044aed5aa.jpg', rating: 4.6, desc: 'Luxury SUV for town cruising.', amenities: ['snowflake', 'music'], reviews: [] },
    { id: 5, type: 'Stay', name: 'Kijani Beach House', loc: 'Casuarina, Malindi', price: 18500, img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', rating: 4.9, desc: 'Eco-luxury beach access.', amenities: ['wifi', 'coffee'], reviews: [] },
    { id: 6, type: 'Car', name: 'Toyota Vanguard (Black)', loc: 'Malindi CBD', price: 7500, img: 'https://kai-and-karo.ams3.cdn.digitaloceanspaces.com/media/vehicles/images/IMG-20231012-WA0038.jpg', rating: 4.5, desc: '7-seater family car.', amenities: ['users', 'snowflake'], reviews: [] },
    { id: 7, type: 'Car', name: 'Suzuki Jimny 4x4', loc: 'Watamu Road', price: 6000, img: 'https://d20plav1k4kerc.cloudfront.net/media/uploads/assessment/prescreeningimage/a2ce9bbc-3eba-4d80-8889-46503a1ec6c7.jpeg', rating: 4.9, desc: 'Ultimate adventure 4x4.', amenities: ['mountain', 'compass'], reviews: [] }
];

// Home Page
app.get('/', (req, res) => {
    const searchQuery = req.query.q ? req.query.q.toLowerCase() : "";
    const filteredListings = (searchQuery === "" || searchQuery === "all") 
        ? listings 
        : listings.filter(item => 
            item.name.toLowerCase().includes(searchQuery) || 
            item.type.toLowerCase().includes(searchQuery) ||
            item.loc.toLowerCase().includes(searchQuery)
        );
    res.render('index', { listings: filteredListings });
});

// Details Page
app.get('/listing/:id', (req, res) => {
    const item = listings.find(l => l.id === parseInt(req.params.id));
    if (!item) return res.status(404).send('Listing not found');
    if (!item.amenities) item.amenities = []; 
    res.render('details', { item });
});

// About Page
app.get('/about', (req, res) => {
    res.render('about');
});

// Admin View
app.get('/admin', (req, res) => {
    res.render('admin', { listings: listings });
});

// Admin Add
app.post('/admin/add', (req, res) => {
    const newItem = {
        id: Date.now(), // Unique ID based on time
        type: req.body.type,
        name: req.body.name,
        loc: req.body.loc,
        price: parseInt(req.body.price),
        img: req.body.img || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        rating: 5.0,
        desc: req.body.desc,
        amenities: req.body.amenities ? req.body.amenities.split(',') : [],
        reviews: []
    };
    listings.push(newItem);
    res.redirect('/admin'); 
});

// Admin Delete
app.get('/admin/delete/:id', (req, res) => {
    listings = listings.filter(l => l.id !== parseInt(req.params.id));
    res.redirect('/admin');
});

app.listen(PORT, () => console.log(`StaySafariKE live at http://localhost:${PORT}`));