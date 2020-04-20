# Game of Thrones API

**To run the app just type `npm i`and then `docker-compose up`**.

The backend will run on: http://localhost:4000. You can always change it
from the docker-compose file.

#### **Testing**:
* Jest was used for unit testing and Supertest was used for API testing.
* One basic unit test is implemented and one functional test for the Rest API, tests reside in the test folder.
**To run the test `npm run test`.

#### **REST API**:
* `GET` http://localhost:4000/houses is used to return a stream for all the houses returned from the API: https://anapioficeandfire.com.
This endpoint get all the houses page by page and return the result of each page on an ongoing stream. Less footprint on memory, performance and latency were the motivations behind this implementation. 
* `GET` http://localhost:4000/houses/:id?isAlive=true is used to return a specific house with the list of the sworn members. It have filtering in place with the flag **isAlive** to be `true` of `false`, giving the option to filter for alive or dead members.

Some Notes:
* This project was created using typescript and does not include an explicit build step (for transpiling typescript to js), it is done using the `ts-node` (https://github.com/TypeStrong/ts-node) which eliminates the burden of figuring out the error line
on the actual typescript file (it has a nice source map support).
* There is a basic validation in place for the `isAlive` flag.
* There is a docker multi-stage building for the container in different environments.

#### PS: Please at the end give some technical feedback to this solution, as I invested my private time on it, I would like to get valuable feedback for my code/solution, Thanks !                                

