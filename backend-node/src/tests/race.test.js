const mongoose = require('mongoose')
const { MongoMemoryServer } = require("mongodb-memory-server")

const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const Race = require('../models/Race')

const mongod = new MongoMemoryServer()

beforeAll(async () => {
    await mongod.start()
    const uri = await mongod.getUri()
    await mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
    });
});

afterAll(done => {
    mongoose.connection.close()
    mongod.stop()
    done()
})

afterEach(async () => {
    const collections = mongoose.connection.collections
    for(const key in collections){
        const collection = collections[key]
        await collection.deleteMany()
    }
})

describe("Test the race paths", () => {
    test("GET /all", async () => {
        await (function (done) {request.post("/api/race/all").expect(200, done)})
    })

    test("POST /create", async () => {
        var newRace = new Race ({
            "raceName": "The duo",
            "raceDescription": "Classical duo of two fierce horses",
            "raceTrack": "500m-g",
            "startingTime": `2022-05-04T20:15:00.000+00:00`,
            "participatingHorses": ["Funk", "Cloe"],
            "horseColors": ["Green", "Red"],
            "createdBy": "Zelda"
        })
        await (function (done) {
            request.post("/api/race/create")
            .send({newRace}).expect(200, done)
        })
    })

    test("POST /signup and GET /getUserActiveRaces/:userName", async () => {
        await request.post("/api/auth/signup")
            .send({
                userName: "Zelda",
                password: "12345Qw",
                passwordConfirmation: "12345Qw"
            })
            .expect(200).then(function (done) {  
                request.get("/api/race/getUserActiveRaces/Zelda")
                .expect(200, done)
            })
    })
})