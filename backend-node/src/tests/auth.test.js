const mongoose = require('mongoose')
const { MongoMemoryServer } = require("mongodb-memory-server")

const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);

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

describe("Test the user paths", () => {
    test("valid POST /signup", async () => {
        await (function (done) {request.post("/api/auth/signup")
            .send({
                userName: "Zelda",
                password: "12345Qw",
                passwordConfirmation: "12345Qw"
            })
            .expect(200, done)})
    })
    
    test("invalid POST /signup", async () => {
        await (function (done) {request.post("/api/auth/signup")
        .send({
            userName: "InvalidTest",
            password: "12345Qw",
            passwordConfirmation: "1234Qw"
        })
        .expect(422, done)})
    })
    
    test("POST /signup and GET /:userName", async () => {
        await request.post("/api/auth/signup")
            .send({
                userName: "Zelda",
                password: "12345Qw",
                passwordConfirmation: "12345Qw"
            }).expect(200).then(function (done){
                request.get("/api/auth/Zelda").expect(200, done)
            })
        
    })
    
    test("POST /signup and GET /login", async () => {
        await request.post("/api/auth/signup")
            .send({
                userName: "Zelda",
                password: "12345Qw",
                passwordConfirmation: "12345Qw"
            }).expect(200).then(function (done){
                request.post("/api/auth/login").send({
                    userName: "Zelda",
                    password: "12345Qw"
                }).expect(200, done)
            })
    })

    test("POST /signup and GET /checkBalance/:userName", async () => {
        await request.post("/api/auth/signup")
            .send({
                userName: "Zelda",
                password: "12345Qw",
                passwordConfirmation: "12345Qw"
            }).expect(200).then(function (done){
                request.get("/api/auth/checkBalance/Zelda").expect(200).then(response => {
                    assert(response, 25);
                    done();
                })
            })
    })
})

