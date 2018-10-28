const React = require('react');
const Auth = require('./Auth');
const LoginFormContainer = require('./LoginFormContainer');

const DEFAULT_PATH = '/oauth/token';
const DEFAULT_ERROR_MESSAGE = 'An error occurred while logging in. Please try again.';

// Allows a user to log in using OAuth
// Both the login form and the logged-in content are passed in
module.exports = class OAuth extends React.Component {
  attemptLogin = ({ username, password }) => {
    const {
      httpClient,
      path = DEFAULT_PATH,
    } = this.props;

    return httpClient.post(path, {
      grant_type: 'password',
      username,
      password,
    })
      .then(this.handleSuccessResponse)
      .catch(this.handleErrorResponse);
  }

  handleSuccessResponse = (response) => {
    const { handleAccessToken } = this.props;

    const { access_token } = response.data;
    handleAccessToken(access_token);
  }

  handleErrorResponse = (error) => {
    const {
      defaultErrorMessage = DEFAULT_ERROR_MESSAGE,
    } = this.props;

    let message;
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.error_description
    ) {
      message = error.response.data.error_description;
    } else {
      message = defaultErrorMessage;
    }
    throw message;
  }

  render() {
    return (
      <Auth
        renderForm={this.props.renderForm}
        attemptLogin={this.attemptLogin}
      >
        {this.props.children}
      </Auth>
    );
  }
}