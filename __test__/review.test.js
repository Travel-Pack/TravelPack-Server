const request = require("supertest");
const app = require("../app.js");
const { hashPassword } = require("../helpers/bcryptjs.js");
const { createToken } = require("../helpers/jsonwebtoken.js");
const { User, Review, sequelize } = require("../models");

let admin_access_token;
let customer_access_token;
let customer_access_token_2;

beforeAll(async function () {
  let userAdmin = await User.create({
    fullName: "User Admin",
    phoneNumber: "000123456789",
    email: "userAdmin@gmail.com",
    password: "admin",
    isPremium: false,
    role: "Admin",
  });

  let userCustomer = await User.create({
    fullName: "User Customer",
    phoneNumber: "000123456789",
    email: "userCustomer@gmail.com",
    password: "customer",
    isPremium: false,
    role: "Customer",
  });

  let userCustomer2 = await User.create({
    fullName: "User Customer",
    phoneNumber: "000123456789",
    email: "userCustomer2@gmail.com",
    password: "customer",
    isPremium: false,
    role: "Customer",
  });

  admin_access_token = createToken({ id: userAdmin.id });
  customer_access_token = createToken({ id: userCustomer.id });
  customer_access_token_2 = createToken({ id: userCustomer2.id });

  await sequelize.queryInterface.bulkInsert(
    "Users",
    require("../data/users.json").map((el) => {
      el.password = hashPassword(el.password);
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "Provinces",
    require("../data/provinces.json").map((el) => {
      delete el.id;
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: el.name.toLocaleLowerCase().split(" ").join("-"),
      };
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "Cities",
    require("../data/cities.json").map((el) => {
      delete el.id;
      return {
        ...el,
        slug: el.name.toLocaleLowerCase().split(" ").join("-"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "Destinations",
    require("../data/destination.json").map((el) => {
      delete el.id;
      return {
        ...el,
        slug: el.name.toLocaleLowerCase().split(" ").join("-"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "Hotels",
    require("../data/hotel.json").map((el) => {
      return {
        ...el,
        slug: el.name.toLocaleLowerCase().split(" ").join("-"),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "Reviews",
    require("../data/review.json").map((el) => {
      return {
        ...el,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );
});

afterAll(async function () {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Provinces", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Cities", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Destinations", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Reviews", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Reviews", () => {
  describe("GET /reviews", () => {
    test("200, success get reviews", async () => {
      const res = await request(app)
        .get("/reviews/1")
        .set({ access_token: customer_access_token });
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
    });
  });
  describe("GET /reviews", () => {
    test("400, failed get reviews", async () => {
      const res = await request(app).get("/reviews/1");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
  describe("POST /reviews", () => {
    test("201, success create reviews", async () => {
      const res = await request(app)
        .post("/reviews")
        .set({ access_token: customer_access_token })
        .send({
          DestinationId: 1,
          HotelId: 1,
          cost: 3,
          fun: 4,
          internet: 3,
          safety: 3,
          comment:
            "The place is extraordinary, the hotels and villas are not expensive, recommended for holidays",
          UserId: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
  describe("POST /reviews", () => {
    test("400, failed create reviews", async () => {
      const res = await request(app)
        .post("/reviews")
        .set({ access_token: customer_access_token });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
  describe("PUT /reviews/:id", () => {
    test("201, success put reviews", async () => {
      const res = await request(app)
        .put("/reviews/1")
        .set({ access_token: admin_access_token })
        .send({
          DestinationId: 1,
          HotelId: 1,
          cost: 3,
          fun: 4,
          internet: 3,
          safety: 3,
          comment:
            "The place is extraordinary, the hotels and villas are not expensive, recommended for holidays",
          UserId: 1,
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
  describe("PUT /reviews/:id", () => {
    test("403, failed not admin put reviews", async () => {
      const res = await request(app)
        .put("/reviews/1")
        .set({ access_token: customer_access_token })
        .send({
          DestinationId: 1,
          HotelId: 1,
          cost: 3,
          fun: 4,
          internet: 3,
          safety: 3,
          comment:
            "The place is extraordinary, the hotels and villas are not expensive, recommended for holidays",
          UserId: 1,
        });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
  describe("PUT /reviews/:id", () => {
    test("404, put reviews not found", async () => {
      const res = await request(app)
        .put("/reviews/99")
        .set({ access_token: admin_access_token })
        .send({
          DestinationId: 1,
          HotelId: 1,
          cost: 3,
          fun: 4,
          internet: 3,
          safety: 3,
          comment:
            "The place is extraordinary, the hotels and villas are not expensive, recommended for holidays",
          UserId: 1,
        });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
  describe("DEL /reviews/:id", () => {
    test("200, success delete reviews", async () => {
      const res = await request(app)
        .delete("/reviews/1")
        .set({ access_token: admin_access_token });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
  describe("DEL /reviews/:id", () => {
    test("403, failed delete reviews not authorized", async () => {
      const res = await request(app)
        .delete("/reviews/2")
        .set({ access_token: customer_access_token_2 });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
  describe("DEL /reviews/:id", () => {
    test("404, reviews not found", async () => {
      const res = await request(app)
        .delete("/reviews/99")
        .set({ access_token: admin_access_token });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("msg", expect.any(String));
    });
  });
});
