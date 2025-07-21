
- Setup instructions for running the app locally.

To run locally: 

1. clone repo
2. npm install for packages
3. run command npx ts-node src/app.ts    


packages used:
axios -> for api call
cohere-ai -> for ai-model
express 

[live site](https://test-gold-nu-59.vercel.app)

test query:
https://test-gold-nu-59.vercel.app/api/execute?message=Find%20me%20a%20cheap%20sushi%20restaurant%20in%20downtown%20Los%20Angeles%20that%27s%20open%20now%20and%20has%20at%20least%20a%204-star%20rating&code=pioneerdevai


- Details on configuring environment variables.

PORT=
AUTH_CODE=
COHERE_API_KEY=
FOURSQUARE_API_KEY=
FOURSQUARE_API_BASE=


- Any assumptions or limitations in your implementation.
Some of the limitations encountered where outdated version from the examination and the actual foursquare api, also the lmm i didnt use a openai model since it required a card.
