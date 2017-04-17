import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { Error } from '../Error'
import { createAuthApi } from '../lib/authApi'

import './Profile.css'

export class Profile extends Component {

  state = {
    username: (localStorage.username || ''),
    email: (localStorage.email && (localStorage.email === 'null' ? '' : localStorage.email)) || '',
    password: '',
    error: this.props.error || false
  }

  putUserProfile = createAuthApi(fetch).putUserProfile

  handleUsernameChange = e => {
    e.persist()
    e.preventDefault()
    this.setState(state => ({
      username: e.target.value
    }))
  }

  handleEmailChange = e => {
    e.persist()
    e.preventDefault()
    this.setState(state => ({
      email: e.target.value
    }))
  }

  handlePasswordChange = e => {
    e.persist()
    e.preventDefault()
    this.setState(state => ({
      password: e.target.value
    }))
  }

  handleSubmit = e => {
    e.persist()
    e.preventDefault()

    this.putUserProfile(this.state.username, this.state.password, this.state.email)
    .then(res => this.setState(state => ({
      error: {
        status: 200,
        statusText: 'changed'
      }
    })))
    .catch(error => {
      console.log(error)
      this.setState(state => ({ error }))
    })
  }

  render() {
    if(this.state.error.status === 401 || this.state.error.statusText === 'changed') {
      // Unauthorized
      localStorage.clear()
      return (
        <Redirect to={{
          pathname: '/login',
          state: {
            from: this.props.location
          }
        }}/>
      )
    }
    else if(this.state.error.status === 400) {
      console.log(this.state.error)
      return (
        <div className="Conversations">
          <Error text={`Email validation failed.`}/>
        </div>
      )
    }
    else if(this.state.error) {
      return (
        <div className="Conversations">
          <Error />
        </div>
      )
    }
    else {
      return (
        <div className="Profile">
          <div className="container-fluid">
            <h1>Profile</h1>
            <div className="ApiTokenField ProfileForm">
              <label htmlFor="ApiTokenInput">Your API token:</label>
              <input 
                id="ApiTokenInput"
                className="form-control" 
                type="text" 
                placeholder="Readonly input here…" 
                readOnly
                defaultValue={localStorage.apiToken}
                aria-describedby="ApiTokenHelpBlock"
              />
              <span id="ApiTokenHelpBlock" className="help-block">
                You can use this token to make requests to the server when building the models for the NLP API.
              </span>
            </div>
            <form className="ProfileForm" role="form" onSubmit={this.handleSubmit}>
              <fieldset>
                <div className="form-group">
                  <label htmlFor="emailInput">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="emailInput"
                    placeholder="Email" 
                    defaultValue={this.state.email}
                    onChange={this.handleEmailChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="usernameInput">Username</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="usernameInput" 
                    placeholder="Username"
                    defaultValue={this.state.username}
                    onChange={this.handleUsernameChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="passwordInput">New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="passwordInput" 
                    placeholder="Password" 
                    onChange={this.handlePasswordChange}
                  />
                </div>
                
                <button type="submit" className="btn btn-default">Submit</button>
                <div className="ProfileTip">
                  <small>You will have to sign in again, after submitting this form.</small>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      )
    }
  }
}