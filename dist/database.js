"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SolrNode = require('solr-node');
const solrClient = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'songs',
    protocol: 'http',
});
// Set logger level (can be set to DEBUG, INFO, WARN, ERROR, FATAL or OFF)
const connectDB = async (dbURI) => {
    try {
        await mongoose_1.default.connect(dbURI);
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
exports.default = solrClient;
