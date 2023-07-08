import mongoose from 'mongoose';
const SolrNode = require('solr-node');

const solrClient = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'songs', 
    protocol: 'http',
  });

  // Set logger level (can be set to DEBUG, INFO, WARN, ERROR, FATAL or OFF)

  

export const connectDB = async (dbURI: string) => {
  try {
    await mongoose.connect(dbURI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database: ', error);
    process.exit(1);
  }
};

export default solrClient;
