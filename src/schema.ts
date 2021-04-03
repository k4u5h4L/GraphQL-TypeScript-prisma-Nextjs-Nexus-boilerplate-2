// import { makeSchema, queryType, objectType, mutationType } from "@nexus/schema";
import {makeSchema, queryType, objectType, mutationType} from "nexus";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import path from "path";

// import {PrismaClient} from "@prisma/client"

// const prisma = new PrismaClient();

const Movie = objectType({
  name: "Movie",
  definition(t: any) {
    t.model.id();
    t.model.rating();
    t.model.name();
    t.model.description();
  },
});

const Query = queryType({
  definition(t: any) {
    t.crud.movie({
      resolve: (_root, args, ctx) => {
        return ctx.prisma.movie.findFirst({ where: { id: args.where.id } });
      },
    });

    t.crud.movies({ pagination: true, filtering: true });

    // for a more 'manual' approach:
    
    // t.field("movie", {
    //   type: Movie,
    //   nullable: true,
    //   args: {
    //     id: idArg(),
    //   },
    //   resolve: (_root, { id }, ctx) => {
    //     return ctx.prisma.movie.findOne({ where: { id: Number(id) } });
    //   },
    // });
  },
});

const Mutation = mutationType({
  definition(t: any) {
    t.crud.createOneMovie();
  },
});

export const schema = makeSchema({
  types: { Query, Movie, Mutation },
  // CRUD won't work without this option!!!
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), "schema.graphql"),
    typegen: path.join(process.cwd(), "nexus.schema.ts"),
  },
  // typegenAutoConfig: {
  //   contextType: "Context.Context",
  //   sources: [
  //     {
  //       source: "@prisma/client",
  //       alias: "prisma",
  //     },
  //     {
  //       source: require.resolve("./context"),
  //       alias: "Context",
  //     },
  //   ],
  // },
});
