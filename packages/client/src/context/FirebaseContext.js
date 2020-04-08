// @flow
import React from 'react'

import {Redirect, withRouter} from 'react-router-dom'
import {fb} from '../firebase'

const defaultFirebaseContext = {
  authStatusReported: false,
  isUserSignedIn: false,
  userObj: null
}

export const FirebaseAuthContext = React.createContext(defaultFirebaseContext)




export class FirebaseAuthProvider extends React.Component {
  state = defaultFirebaseContext

  componentDidMount() {
    fb.auth.onAuthStateChanged(user => this.setState({
      authStatusReported: true,
      isUserSignedIn: !!user,
      userObj: user
    }))
  }

  render() {
    const {children} = this.props
    const { authStatusReported, isUserSignedIn, userObj } = this.state

    return (
      <FirebaseAuthContext.Provider value={{isUserSignedIn, authStatusReported, userObj}}>
        {children}
      </FirebaseAuthContext.Provider>
    )
  }
}

class ProtectedScreen extends React.Component {
  render() {
      const {children} = this.props;
      return (
          <FirebaseAuthContext.Consumer>
              {
                  ({isUserSignedIn}) => {
                      if (isUserSignedIn) {
                          return children
                      }
                      return <Redirect to="/login" />;
                  }
              }
          </FirebaseAuthContext.Consumer>
      )
  }
};

export default withRouter(ProtectedScreen)