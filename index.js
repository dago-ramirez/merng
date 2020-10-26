const { ApolloServer } = require('apollo-server');
const gql = require ('graphql-tag');
const mongoose = require('mongoose');
const { MONGODB } = require('./config.js');

const typeDefs = gql`
    type Query{
        sayHi: String!
    }
`

const resolvers = {
    Query: {
        sayHi: () => 'Hello World!!!!'
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Se conecta con la base de datos y se inicia el servidor
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => {
        console.log('MongoDB connected');
        return server.listen({ port: 5000 });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    });

    