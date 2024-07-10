const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server);

const API_KEY = 'ZZ5C8GAM6R5PW3BR'; // Replace with your actual API key
const STOCK_SYMBOL = 'AAPL'; // Example stock symbol

io.on('connection', (socket) => {
    console.log('New client connected');

    const fetchStockData = async () => {
        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${STOCK_SYMBOL}&interval=1min&apikey=${API_KEY}`);
            const data = response.data['Time Series (1min)'];
            console.log('Fetched data:', data); // Add this line
            socket.emit('stockData', data);
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // Fetch data every minute

    socket.on('disconnect', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

server.listen(4000, () => console.log('Server running on port 4000'));
