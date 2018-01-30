const OT = require('@opentok/client');

// Set Credentials
const apiKey = '';
const sessionId = '';
const token = '';

// Initialize Session
const session = OT.initSession(apiKey, sessionId);

// Set session event listeners
session.on({
  streamCreated: (event) => {
    session.subscribe(event.stream, 'subscriber', (error) => {
      if (error) {
        console.log(`There was an issue subscribing to the stream: ${error}`);
      }
    });
  },
  streamDestroyed: (event) => {
    console.log(`Stream with name ${event.stream.name} ended because of reason: ${event.reason}`);
  }
});

// Connect to the session
session.connect(token, (error) => {
  // If the connection is successful, initialize a publisher and publish to the session
  if (error) {
    console.log(`There was an error connecting to session: ${error}`);
    return;
  }
  // Create a publisher
  const publisher = OT.initPublisher('publisher', (initError) => {
    if (initError) {
      console.log(`There was an error initializing the publisher: ${initError}`);
    }
  });
  session.publish(publisher, (pubError) => {
    if (pubError) {
      console.log(`There was an error when trying to publish: ${pubError}`);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#shareScreen').addEventListener('click', () => {
    OT.checkScreenSharingCapability((response) => {
      console.log(response);
      if (response.supported) {
        var screenSharingPublisher = OT.initPublisher('screen-preview', { videoSource: 'screen' });
        session.publish(screenSharingPublisher, function(error) {
          if (error) {
            alert('Could not share the screen: ' + error.message);
          }
        });
      }
    });
  });
});
