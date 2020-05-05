import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import { Row, Col, Layout } from "antd";
import { LISTING } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { PageSkeleton, ErrorBanner } from "../../lib/components";

interface MatchParams {
  id: string;
}

const { Content } = Layout;

const PAGE_LIMIT = 3;

export const Listing = () => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const { id } = useParams<MatchParams>();

  const { data, loading, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  if (loading) {
    return (
      <Content className="listing">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listing">
        <ErrorBanner description="Something went wrong loading this listing, please try again later." />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  return <h1>Listing</h1>;
};
