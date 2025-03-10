import React, { Fragment } from "react";
// The useQuery hook leverages React's Hooks 
// API to fetch and load data from queries 
// into our UI. It exposes error, loading 
// and data properties through a result object, 
// that help us populate and render our component. 
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { LaunchTile, Header, Button, Loading } from "../components";

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${ LAUNCH_TILE_DATA }
`;

const Launches = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES);

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map(launch => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
      {data.launches && 
        data.launches.hasMore && (
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  after: data.launches.cursor,
                },
                updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...fetchMoreResult,
                    launches: {
                      ...fetchMoreResult.launches,
                      launches: [
                        ...prev.launches.launches,
                        ...fetchMoreResult.launches.launches,
                      ],
                    },
                  };
                },
              })
            }
          >
            Load More
          </Button>
        )
      }
    </Fragment>
  );
};

export const LAUNCH_TILE_DATA = gql`
fragment LaunchTile on Launch {
  id
  isBooked
  rocket {
    id
    name
  }
  mission {
    name
    missionPatch
  }
}
`;



export default Launches;