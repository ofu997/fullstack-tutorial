import { useMutation } from '@apollo/react-hooks'; // preserve-line
import gql from 'graphql-tag';
import React from 'react';
import Button from '../components/button'; // preserve-line
import * as GetCartItemsTypes from '../pages/__generated__/GetCartItems';
import { GET_LAUNCH } from './cart-item'; // preserve-line
import * as BookTripsTypes from './__generated__/BookTrips';


const BookTrips = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface BookTripsProps extends GetCartItemsTypes.GetCartItems {}

const BookTrips: React.FC<BookTripsProps> = ({ cartItems }) => {
  const [
    bookTrips, { data }
  ] = useMutation<
    BookTripsTypes.BookTrips, 
    BookTripsTypes.BookTripsVariables
  > (
    BOOK_TRIPS,
    {
      variables: { launchIds: cartItems },
      refetchQueries: cartItems.map(launchId => ({
        query: GET_LAUNCH,
        variables: { launchId },
      })),
      update(cache) {
        cache.writeData({ data: { cartItems: [] } });
      }
    }
  );

  return data && data.bookTrips && !data.bookTrips.success
    ? <p data-testid="message">{data.bookTrips.message}</p>
    : (
      <Button 
        onClick={() => bookTrips()} 
        data-testid="book-button">
        Book All
      </Button>
    );
}

export default BookTrips;
