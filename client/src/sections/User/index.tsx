import React from "react";
import {useParams} from "react-router";
import {useQuery} from "@apollo/react-hooks";
import {Col, Row, Layout} from "antd";
import {USER} from "../../lib/graphql/queries";
import {User as UserData, UserVariables} from "../../lib/graphql/queries/User/__generated__/User";
import {PageSkeleton, ErrorBanner} from "../../lib/components";
import {Viewer} from "../../lib/types";
import {UserProfile} from "./components";

interface Props {
    viewer: Viewer;
}

interface MatchParams {
    id: string;
}

const {Content} = Layout;

export const User = ({viewer}: Props) => {
    const {id} = useParams<MatchParams>();

    const {data, loading, error} = useQuery<UserData, UserVariables>(USER, {
        variables: {
            id: id
        }
    });

    if(loading) {
        return (
            <Content className="user">
                <PageSkeleton />
            </Content>
        )
    }

    if (error) {
        return (
            <Content className="user">
                <ErrorBanner description="This user may not exist or we have encountered an error. Please try again." />
                <PageSkeleton />
            </Content>
        )
    }

    const user = data ? data.user: null;
    const viewerIsUser = viewer.id === id;

    const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser}/> : null;
    return (
        <Content className="user">
            <Row gutter={12} justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
            </Row>
        </Content>
    )
};