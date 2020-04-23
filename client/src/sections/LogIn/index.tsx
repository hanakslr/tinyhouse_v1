import React, {useEffect, useRef} from "react";
import {Redirect} from "react-router";
import {useApolloClient, useMutation} from "@apollo/react-hooks";
import { Card, Layout, Spin, Typography } from "antd";
import {ErrorBanner} from "../../lib/components/ErrorBanner";
import {LOG_IN} from "../../lib/graphql/mutations";
import {AUTH_URL} from "../../lib/graphql/queries";
import {LogIn as LogInData, LogInVariables} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import {AuthUrl as AuthUrlData} from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {Viewer} from '../../lib/types';
import { displaySuccessNotification, displayErrorNotification} from "../../lib/utils";

// Image Assets
import googleLogo from "./assets/google_logo.jpg";

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = ({setViewer}: Props) => {
  const client = useApolloClient();
  const [logIn, 
    {data: logInData, loading: logInLoading, error: logInError }
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    // onCompleted is the callback function called on the completion of a
    // successful mutation. It only arguement is the data from the completed
    // mutation
    onCompleted: (data) => {
      if(data && data.logIn) {
        setViewer(data.logIn);
        displaySuccessNotification("You are successfully logged in.");
      }
    }
  });

  const logInRef = useRef(logIn);

  // empty dependencies list because we don't want this to run after the component
  // has mounted. We are using useRef here because using the logIn function inside
  // of useEffect requires that it be a dependency. We don't want that. If the 
  // component we to get re-rendered, a new logIn would be created and we would
  // have to log in again. logInRef.current will always reference the first instance 
  // of the logIn function. This should be done sparingly.
  useEffect(()=> {
    const code = new URL(window.location.href).searchParams.get("code");

    if(code) {
      logInRef.current({
        variables: {
          input: {code}
        }
      })
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const {data} = await client.query<AuthUrlData>({
        query: AUTH_URL
      });

      // redirect to google consent page
      window.location.href = data.authUrl;

    } catch {
      displayErrorNotification("Sorry! We were not able to tog you in. Please try again.");
    }
  }

  if(logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Loggin you in..."/>
      </Content>
    )
  }

  // If we have logInData we don't want to stay on the log in page. Redirect to the user page.
  if(logInData && logInData.logIn) {
    const {id: viewerId} = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later."/>
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button className="log-in-card__google-button" onClick={handleAuthorize}>
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in to your Google account.
        </Text>
      </Card>
    </Content>
  );
};
