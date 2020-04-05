import React from "react";
import {server} from '../../lib/api'
import {ListingsData, DeleteListingData, DeleteListingVariables} from './types'

const LISTINGS = `
query Listings {
    listings {
        id
        title
        image
        address
        price
        numOfGuests
        numOfBeds
        numOfBaths
        rating
    }
}`;

const DELETE_LISTING = `
mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
        id
    }
}
`;

interface Props {
    title: string
}
export const Listings = ({title}: Props) => {
    const fetchListings = async () => {
        const {data} = await server.fetch<ListingsData>({query: LISTINGS});
        console.log(data);
    };

    const deleteListing = async () => {
        const {data} = await server.fetch<DeleteListingData, DeleteListingVariables>({
            query: DELETE_LISTING,
            variables: {
                id: "5e8867b65e36b83cc86ea32a"
            }
        });
        console.log(data);
    }

    return (
        <div>
            <h2>{title}</h2>
            <button onClick={fetchListings}>Query Listings</button>
            <button onClick={deleteListing}>Delete Listing</button>
        </div>
    ) ;
};
