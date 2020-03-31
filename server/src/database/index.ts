import {MongoClient} from "mongodb";

const user = 'hana';
const userPassword = '3vw9HSwFscIKlXGQ';
const cluster = 'cluster0-6qyvc';

const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/test?retryWrites=true&w=majority`;

export const connectDatabase = async () => {
   const client = await MongoClient.connect(url, {
       useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = client.db('main');

    return {
        listings: db.collection('test_listings')
    };
};