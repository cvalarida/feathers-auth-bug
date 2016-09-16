// Import FeathersJS
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import hooks from 'feathers-hooks';
import io from 'socket.io-client';
import authentication from 'feathers-authentication/client';

// Use FeathersJS
const socket = io();
const app = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(authentication({ storage: window.localStorage }));


// When we click the Log In button, attempt to log in
$('#loginForm').submit((event) => {
  event.preventDefault();

  let email = $('#emailInput').val();
  let password = $('#passwordInput').val();

  console.log(`Logging in with ${email}: ${password}`);

  app.authenticate({ type: 'local', email, password })
    .then(function(response) {
      $('#messages').empty();
      
      // Add the success message to the window
      $('#messages').append(`<div class="login-success center-text">Successfully logged in as ${email}!</div>`);
      console.log(response);
    })
    .catch(function(error) {
      $('#messages').empty();

      // Add the error message to the window
      if (error.message === "Invalid login.")
        $('#messages').append(`<div class="twelve columns login-failure center-text">Invalid username or password. Check the console log for details.</div>`);
      else
        $('#messages').append(`<div class="twelve columns login-failure center-text">Could not log in as ${email}. Check the console log for details.</div>`);

      console.log("Login error:", error);
    });
});
