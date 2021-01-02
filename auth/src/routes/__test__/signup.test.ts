import request from "supertest";
import { app } from "../../app";

it("Return a 201 on sucessfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "password",
    })
    .expect(201);
});

it("Invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@",
      password: "password",
    })
    .expect(400);
});

it("return with 400 with invalid passwod", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@",
      password: "pas",
    })
    .expect(400);
});

it("return a 400 with missing email and password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "",
    })
    .expect(400);
});

it("Disallowed duplicate emails ", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "bharatrose1@gmail.com",
        password: "password",
      })
      .expect(201);

      await request(app)
      .post("/api/users/signup")
      .send({
        email: "bharatrose1@gmail.com",
        password: "password",
      })
      .expect(400);
  });

it('sets a cooki after succefull signup', async() => {
    const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "password",
    })
    .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
  })