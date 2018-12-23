import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

// import { login } from '../api/api';

const FormItem = Form.Item;

export default class Login extends React.Component {
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
    this.props.login(username, password, true);
    /*
    login(username, password, true, json => {
      console.log('login', json);
      if (json.status) {
      } else {
        // this.props.save("token", json.id_token);
        localStorage.setItem('token', json.id_token);
      }
    });
    // console.log("Login");
    */
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
