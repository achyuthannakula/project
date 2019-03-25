import auth0 from "auth0-js";

class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: "tachyon.auth0.com",
      clientID: "Z999dm2xolFnCiOUE913uNvIiMAq3sOv",
      redirectUri: "http://localhost:3000/callback",
      audience: "https://tachyon.auth0.com/userinfo",
      responseType: "token id_token",
      scope: "openid profile email"
    });

    this.authFlag = "isLoggedIn";
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  getIdToken() {
    return this.idToken;
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash(async (err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        console.log("auth result", authResult);
        await this.setSession(authResult);
        await resolve();
      });
    });
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    // set the time that the id token will expire at
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    localStorage.setItem(this.authFlag, JSON.stringify(true));
  }

  logout(location) {
    localStorage.setItem(this.authFlag, JSON.stringify(false));
    localStorage.setItem("userInfo", null);
    this.auth0.logout({
      returnTo: location,
      clientID: "Z999dm2xolFnCiOUE913uNvIiMAq3sOv"
    });
  }

  silentAuth() {
    if (this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        this.auth0.checkSession({}, (err, authResult) => {
          if (err) {
            localStorage.removeItem(this.authFlag);
            return reject(err);
          }
          console.log("in silent auth", authResult);
          this.setSession(authResult);
          resolve();
        });
      });
    }
  }

  isAuthenticated() {
    // Check whether the current time is past the token's expiry time
    //return new Date().getTime() < this.expiresAt;
    return JSON.parse(localStorage.getItem(this.authFlag));
  }
}

const auth = new Auth();

export default auth;
