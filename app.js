const { Bot } = require('grammy');
const bot = new Bot('5864273581:AAGuJYLm4jMIc10rvFSyW7Z4i-WlpzFKP48');

let pointA = null;
let pointB = null;

bot.command('start', (ctx) => {
    ctx.reply('Welcome! Please enter the coordinates of point A in the format "latitude,longitude".');
});

bot.on('message', (ctx) => {
    const messageText = ctx.message.text;
    const coords = messageText.split(',');
    if (coords.length !== 2) {
        ctx.reply('Invalid format. Please enter the coordinates in the format "latitude,longitude".');
        return;
    }
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    if (isNaN(lat) || isNaN(lng)) {
        ctx.reply('Invalid coordinates. Please enter valid numbers for latitude and longitude.');
        return;
    }
    if (!pointA) {
        pointA = { lat, lng };
        ctx.reply(`Point A set to (${lat},${lng}). Please enter the coordinates of point B in the format "latitude,longitude".`);
    } else if (!pointB) {
        pointB = { lat, lng };
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(pointB.lat - pointA.lat);
        const dLng = deg2rad(pointB.lng - pointA.lng);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(pointA.lat)) * Math.cos(deg2rad(pointB.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        ctx.reply(`Point B set to (${lat},${lng}). The distance between point A and point B is ${distance} km.`);
        pointA = null;
        pointB = null;
    }
});

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

bot.start();
