const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHelper')
const Campground = require('../models/location');

mongoose.connect('mongodb://localhost:27017/WebTechProject', {
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random100 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '60695b0811baa50b3c015e83',
            location: `${cities[random100].city}, ${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime aliquam, tempore dolorem doloribus, quae dolor cum exercitationem minima sequi enim placeat repellendus dolore unde ipsum earum ex quod odit expedita!',
            price,
            geometry:
            {
                type: "Point",
                coordinates: [
                    cities[random100].longitude,
                    cities[random100].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/heisenberg22/image/upload/v1617957750/YelpCamp/ekcqmwxhc5frvot44orb.jpg',
                    filename: 'YelpCamp/ekcqmwxhc5frvot44orb'
                }
            ]

        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
