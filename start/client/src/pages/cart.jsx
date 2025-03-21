import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { Fragment } from 'react';
import { Header, Loading } from '../components';
import { BookTrips, CartItem } from '../containers';


// interface CartProps extends RouteComponentProps {

// }

// const Cart: React.FC<CartProps> = () => {
//   return <div />;
// }

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;

const Cart = () => {
  const { data, loading, error } = useQuery(GET_CART_ITEMS);

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <Fragment>
      <Header>My Cart</Header>
      {!data || (!!data && data.cartItems.length === 0) ? (
        <p data-testid="empty-message">No items in your cart</p>
      ) : (
        <Fragment>
          {!!data &&
            data.cartItems.map(launchId => (
              <CartItem key={launchId} launchId={launchId} />
            ))}

          <BookTrips cartItems={!!data ? data.cartItems : []} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;