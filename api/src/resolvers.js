/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your scheama
 */

module.exports = {
  Query: {
    pets(_, { input }, { models }) {
      return models.Pet.findMany(input);
    },

    pet(_, { input }, { models }) {
      return models.Pet.findOne(input);
    },
  },

  Mutation: {
    newPet(_, { input }, { models }) {
      return models.Pet.create(input);
    },
  },

  Pet: {
    img(pet) {
      return pet.type === "DOG"
        ? "https://placedog.net/300/300"
        : "http://placekitten.com/300/300";
    },
    user(pet, _, { models }) {
      return models.User.findOne();
    },
  },

  User: {
    pets(user, _, { models }) {
      return models.Pet.findMany({ user: user.id });
    },
  },
};
