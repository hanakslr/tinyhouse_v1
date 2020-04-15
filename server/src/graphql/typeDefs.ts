import { gql } from "apollo-server-express"

export const typeDefs = gql`
         type Viewer {
           id: id
           token: String
           avatar: String
           hasWallet: Boolean
           didRequest: Boolean!
         }
         input LogInInput {
           code: String!
         }

         type Query {
           authUrl: String!
         }

         type Mutation {
           logIn(input: LogInInput): Viewer!
           logOut: Viewer!
         }
       `;