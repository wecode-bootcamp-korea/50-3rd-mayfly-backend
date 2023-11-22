const request = require("supertest");

const { createApp } = require("../app");
const { appDataSource } = require("../src/models/datasource");
const { setupDB, resetDB } = require("./testSetup");

const userToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbWUiOiLquYDrrLjsmIEiLCJlbWFpbCI6Im1uNTJpbEBuYXZlci5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTAtMTIzNC01NTU1Iiwicm9sZSI6InVzZXJzIiwiaWF0IjoxNzAwMTk2NDMwLCJleHAiOjE3MDA5MTY0MzB9.WVYdWKjcFjLTyFQdPEKhLsy-XcmUa1B-cNfEcr1WOeI`;
const hostToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsIm5hbWUiOiLstZzrr7zsp4AiLCJlbWFpbCI6ImFsc3dsODE4NEBuYXZlci5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTAtMTExMS05OTk5Iiwicm9sZSI6Imhvc3RzIiwiaWF0IjoxNzAwNTQ1NjgyLCJleHAiOjE3MDEyNjU2ODJ9.8V1tTOzgJOFcCdmBiiJGtIkE298k7BsQhUbk733D3pg`;
const adminToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW5faWQiOiJhZG1pbjExMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTk5NTU1MDB9.MjN3UL4Ie0qnk2owFiqy0cONldqVNtbjFjZj9zJK6Ig`;

describe("좋아요 클릭", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDB(appDataSource);
    // await resetDB(appDataSource);
  });
  afterEach(async () => {
    await resetDB(appDataSource);
  });

  test("SUCCESS : 좋아요 체크", async () => {
    await request(app)
      .post("/likes")
      .set("authorization", `${userToken}`)
      .send({ classId: 1 })
      .expect(200);
  });
});

describe("좋아요 클릭", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDB(appDataSource);
    // await resetDB(appDataSource);
  });
  afterEach(async () => {
    await resetDB(appDataSource);
  });
  test("SUCCESS : 좋아요 체크 해제", async () => {
    await request(app)
      .post("/likes")
      .set("authorization", `${userToken}`)
      .send({ classId: 2 })
      .expect(200);
  });
});

describe("클래스 좋아요 확인", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDB(appDataSource);
    // await resetDB(appDataSource);
  });
  afterEach(async () => {
    await resetDB(appDataSource);
  });

  test("SUCCESS : 전체 클래스 좋아요 확인", async () => {
    const res = await request(app).get("/likes").query({ classId: 2 });

    expect(200);
    expect(res.body).toEqual({ message: "LIKES_LOADED", likes: "4" });
  });
});

describe("유저 좋아요 확인", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDB(appDataSource);
    // await resetDB(appDataSource);
  });
  afterEach(async () => {
    await resetDB(appDataSource);
  });

  test("SUCCESS : 해당 유저의 좋아요 클래스 전체 목록 확인", async () => {
    const res = await request(app)
      .get("/likes/users")
      .set("authorization", `${userToken}`);

    expect(200);
    expect(res.body).toEqual({
      message: "LIKES_LOADED",
      result: [
        {
          address: "서울특별시 강남구 테헤란로 427 (삼성동)",
          hostName: "홍길동",
          id: 2,
          image_source: "main_image_source_2.jpg",
          subName: "명상",
          title: "초급자를 위한 요리 클래스",
          topName: "디지털 마케팅",
        },
      ],
    });
  });
});

describe("유저 좋아요 확인", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDB(appDataSource);
    // await resetDB(appDataSource);
  });
  afterEach(async () => {
    await resetDB(appDataSource);
  });

  test("SUCCESS : 해당 유저의 특정 클래스 좋아요 여부 확인", async () => {
    const res = await request(app)
      .get("/likes/users")
      .set("authorization", `${userToken}`)
      .query({ classId: 2 });

    expect(200);
    expect(res.body).toEqual({
      message: "LIKES_LOADED",
      result: { status: "Yes" },
    });
    console.log(res.body);
  });
});
