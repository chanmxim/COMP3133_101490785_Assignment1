import express from "express"
import dotenv from "dotenv";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from "cors";

import typeDefs from "./graphql/schema/schema.js";
import resolvers from "./graphql/resolvers/resolvers.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000

const app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers
})

await server.start()

app.use(
    '/graphql',
    cors(),
    express.json({ limit: '50mb' }),
    expressMiddleware(server)
)

try{
    await connectDb()
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    })
} catch(e){
    console.error("Failed to start server:", err);
}