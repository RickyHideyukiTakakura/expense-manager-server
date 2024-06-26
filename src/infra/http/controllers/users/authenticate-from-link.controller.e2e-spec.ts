import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { AuthLinkFactory } from "test/factories/make-auth-link";
import { UserFactory } from "test/factories/make-user";

describe("Authenticate from link E2E", () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let userFactory: UserFactory;
  let authLinkFactory: AuthLinkFactory;

  beforeAll(async () => {
    app = (await import("@/infra/app")).app;

    prisma = new PrismaClient();
    userFactory = new UserFactory(prisma);
    authLinkFactory = new AuthLinkFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate an user using link", async () => {
    const user = await userFactory.makePrismaUser({
      name: "John Doe",
      email: "johndoe@example.com",
    });

    const authLink = await authLinkFactory.makePrismaAuthLink({
      userId: user.id,
      code: "test-auth-code",
    });

    const response = await request(app.server)
      .get("/auth-links/authenticate")
      .query({
        code: authLink.code,
        redirect: "http://localhost:5143",
      });

    expect(response.headers["set-cookie"]).toBeDefined();

    const cookies = response.headers["set-cookie"][0];

    expect(cookies).toContain("accessToken");
    expect(response.header["location"]).toBe("http://localhost:5143");
  });

  it("should be able to sign out an user", async () => {
    const user = await userFactory.makePrismaUser({
      name: "John Doe",
      email: "johndoe@gmail.com",
    });

    const authLink = await authLinkFactory.makePrismaAuthLink({
      userId: user.id,
      code: "test-auth-code",
    });

    const responseAuth = await request(app.server)
      .get("/auth-links/authenticate")
      .query({
        code: authLink.code,
        redirect: "http://localhost:5143",
      });

    responseAuth.headers["set-cookie"][0];

    const response = await request(app.server).post("/sign-out").send();

    expect(response.headers["set-cookie"][0]).toContain("accessToken=;");
    expect(response.statusCode).toEqual(200);
  });
});
