import React, { useState } from "react";
import gql from "graphql-tag";
import PetBox from "../components/PetBox";
import NewPet from "../components/NewPet";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loader from "../components/Loader";

const PET_FEILDS = gql`
  fragment Petfeilds on Pet {
    id
    name
    img
    type
    vaccinated @client
  }
`;

const GET_ALL_PETS = gql`
  query GetAllPets {
    pets {
      ...Petfeilds
    }
  }
  ${PET_FEILDS}
`;

const CREATE_A_PET = gql`
  mutation CreateAPet($newPet: newPetInput!) {
    newPet(input: $newPet) {
      ...Petfeilds
    }
  }
  ${PET_FEILDS}
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(GET_ALL_PETS);

  const [createPet, newPet] = useMutation(CREATE_A_PET, {
    update(cache, { data: { newPet } }) {
      const { pets } = cache.readQuery({ query: GET_ALL_PETS });
      cache.writeQuery({
        query: GET_ALL_PETS,
        data: { pets: [newPet, ...pets] },
      });
    },
  });

  console.log(data.pets[0]);

  if (loading) {
    return <Loader />;
  }

  if (error || newPet.error) {
    return <p>{error ? error.message : newPet.error.message}</p>;
  }

  const onSubmit = (input) => {
    setModal(false);
    createPet({
      variables: { newPet: input },
      optimisticResponse: {
        __typename: "Mutation",
        newPet: {
          id: "placeholder_id",
          ...input,
          img: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.stfrancisanimalwelfare.co.uk%2Fhome%2Fplaceholder-logo-3%2F&psig=AOvVaw0jN2tLhNsF5RryAWZevPkw&ust=1626108777762000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCOjAvbK92_ECFQAAAAAdAAAAABAD",
          __typename: "Pet",
          vaccinated: false,
        },
      },
    });
  };

  var petsList = null;
  if (data) {
    petsList = data.pets.map((pet) => (
      <div className="col-xs-12 col-md-4 col" key={pet.id}>
        <div className="box">
          <PetBox pet={pet} />
        </div>
      </div>
    ));
  }

  if (modal) {
    return (
      <div className="row center-xs">
        <div className="col-xs-8">
          <NewPet onSubmit={onSubmit} onCancel={() => setModal(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>{petsList && <div className="row">{petsList}</div>}</section>
    </div>
  );
}
