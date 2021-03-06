// @flow
import React from 'react'

import {Redirect, withRouter} from 'react-router-dom'
import {fb, isUser} from '../firebase'

const defaultFirebaseContext = {
  authStatusReported: false,
  isUserSignedIn: false,
  userID: null
}

export const FirebaseAuthContext = React.createContext(defaultFirebaseContext)




export class FirebaseAuthProvider extends React.Component {
  state = defaultFirebaseContext

  componentDidMount() {
    fb.auth.onAuthStateChanged(user => this.setState({
      authStatusReported: true,
      isUserSignedIn: !!user,
      userID: user.uid
    }))
  }

  render() {
    const { children } = this.props
    const { authStatusReported, isUserSignedIn, userID } = this.state

    return (
      <FirebaseAuthContext.Provider value={{isUserSignedIn, authStatusReported, userID}}>
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


                      if (!isUserSignedIn) {
                        return <Redirect to="/login" />
                      }

                      return children


                  }
              }
          </FirebaseAuthContext.Consumer>
      )
  }
};

export default withRouter(ProtectedScreen)