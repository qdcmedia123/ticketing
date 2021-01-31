import request from "supertest";
import { app } from "../../app";
import { signupRouter } from "../signup";

it("responds with the details about the current user", async () => {
  const cookie = await global.signin();
  console.log(cookie)
  const response = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(400);

  expect(response.body.currentUser.email).toEqual("bharatrose1@gmail.com");
});

it("responds with null it not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
