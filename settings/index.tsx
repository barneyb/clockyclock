import secrets from "./secrets"

function mySettings(props) {
    return (
        <Page>
            <Section
                title={<Text bold align="center">Fitbit Account</Text>}>
                <Oauth
                    settingsKey="oauth"
                    title="Login"
                    label="Fitbit"
                    status="Login"
                    authorizeUrl="https://www.fitbit.com/oauth2/authorize"
                    requestTokenUrl="https://api.fitbit.com/oauth2/token"
                    clientId={secrets.fitbit.id}
                    clientSecret={secrets.fitbit.secret}
                    scope="activity"
                />
            </Section>
        </Page>
    );
}

registerSettingsPage(mySettings);