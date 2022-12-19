import "reflect-metadata";
import dataSource from "./utils";
import { ApolloServer } from "apollo-server";
import { UsersResolver } from "./resolvers/Users";
import { buildSchema } from "type-graphql";
import { customAuthChecker } from "./auth";

const PORT = 4000;

async function bootstrap(): Promise<void> {
  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [UsersResolver],
    authChecker: customAuthChecker,
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    // Context permettant d'accèder au token depuis n'importequel resolver
    context: ({ req }) => {
      // Récypère le header d'authorization
      const authorization: string | undefined = req?.headers?.authorization;

      // Si le header d'authorization n'est pas null on retourne le token
      if (authorization != null) {
        // Bearer ...jwt
        const token = authorization.split(" ").pop();
        return { token };
      }
      // Sinon on retourne un token null
      return { token: null };
    },
  });

  //   Démarrage du server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);

  try {
    // Connexion à la base de donnée (Attente de la connexion avant de passer à la suite)
    await dataSource.initialize().then(() => {
      console.log("DB connected");
    });
  } catch (error) {
    console.log("DB connexion failed");
    console.log(error);
  }
}

bootstrap().then(
  () => {
    console.log("Server Started");
  },
  (error) => {
    console.log("Server Error");
    console.log(error);
  }
);
