const request = require('supertest');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const crypto = require('crypto');

// Base URL of your running server
const BASE_URL = 'http://localhost:3000';

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const TEST_USERNAME = process.env.COGNITO_TEST_USERNAME;
const TEST_PASSWORD = process.env.COGNITO_TEST_PASSWORD;
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
AWS.config.update({
  region: AWS_REGION
});

function calculateSecretHash(username) {
  const message = username + COGNITO_CLIENT_ID;
  return crypto.createHmac('SHA256', COGNITO_CLIENT_SECRET)
    .update(message)
    .digest('base64');
}

function getCognitoToken() {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: TEST_USERNAME,
      PASSWORD: TEST_PASSWORD,
      SECRET_HASH: calculateSecretHash(TEST_USERNAME)
    }
  };

  return cognito.initiateAuth(params).promise()
    .then(data => data.AuthenticationResult.AccessToken)
    .catch(err => {
      console.error('Authentication Error:', err);
      throw err;
    });
}

describe('Math Library Express Integration', () => {

  let authToken;

  // Check if server is running before tests
  // beforeAll(async () => {
  //   try {
  //     await request(BASE_URL).get('/');
  //   } catch {
  //     throw new Error('Server must be running to execute these tests');
  //   }
  // });

  beforeAll(async () => {
    try {
      // First check if server is running
      await request(BASE_URL).get('/');

      console.log("aval in ", COGNITO_CLIENT_ID);
      console.log("badesh username", TEST_USERNAME);
      console.log("Badesh region", AWS_REGION);
      
      // Then get the auth token
      authToken = await getCognitoToken();

      console.log('GOT THE Token yoo:', authToken); 
    } catch (error) {
      if (!authToken) {
        console.error('Failed to get Cognito token:', error);
      } else {
        console.error('Server must be running to execute these tests');
      }
      throw error;
    }
  });

  it('should successfully create a new artist', async () => {
    const newArtist = {
      name: 'Test Artist',
      genre: 'Rock',
      bio: 'This is a test artist biography'
    };


    const response = await request(BASE_URL)
      .post('/artists')
      .send(newArtist)
      .expect('Content-Type', /json/)
      .expect(201);

    // Check if the response contains the artist data
    // expect(response.body).toMatchObject({
    //   name: newArtist.name,
    //   genre: newArtist.genre,
    //   bio: newArtist.bio
    // });

    // Check if an ID was assigned
    // expect(response.body.id).toBeDefined();
  });

});
