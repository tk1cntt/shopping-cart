import React from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import { login, getSession } from '../api/api';

import {
  loginStart,
  loginError,
  loginSuccess,
  getSessionStart,
  getSessionError,
  getSessionSuccess
} from '../background/actions';

const FormItem = Form.Item;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null
    };
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  changeUsername = e => {
    this.setState({ username: e.target.value });
  };

  changePassword = e => {
    this.setState({ password: e.target.value });
  };

  login = () => {
    const { username, password } = this.state;
    this.props.loginStart();
    login(username, password, jsonLogin => {
      console.log('login', jsonLogin);
      if (jsonLogin.status) {
        this.props.loginError(jsonLogin);
      } else {
        this.props.loginSuccess(jsonLogin);
        getSession(jsonLogin.id_token, jsonSession => {
          console.log('getSession', jsonSession);
          if (jsonSession.status) {
            this.props.getSessionError(jsonSession);
          } else {
            this.props.getSessionSuccess(jsonSession);
          }
        });
      }
    });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.changeUsername}
            placeholder="Username"
          />
        </FormItem>
        <FormItem>
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
            onChange={this.changePassword}
          />
        </FormItem>
        <FormItem>
          <Checkbox>Remember me</Checkbox>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <br />
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            onClick={this.login}
          >
            Log in
          </Button>
          <br />
          Or <a href="">register now!</a>
        </FormItem>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  authentication: state.authentication
});

const mapDispatchToProps = dispatch => ({
  loginStart: () => dispatch(loginStart()),
  loginError: data => dispatch(loginError(data)),
  loginSuccess: data => dispatch(loginSuccess(data)),
  getSessionStart: () => dispatch(getSessionStart()),
  getSessionError: data => dispatch(getSessionError(data)),
  getSessionSuccess: data => dispatch(getSessionSuccess(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
