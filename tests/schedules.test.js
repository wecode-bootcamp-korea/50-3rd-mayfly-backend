const request = require("supertest");
const createApp = require("../app");
const { appDataSource } = require("../models/datasource");
const { setupDatabase, resetDatabase } = require('./testSetup');

//한 강의 모든 스케줄 가져오기
describe("Get_all_schedules", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });

  test("SUCCESS: Get schedules by class ID with token", async () => {
    const classId = 1;
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsIm5hbWUiOiLstZzrr7zsp4AiLCJlbWFpbCI6ImFsc3dsODE4NEBuYXZlci5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTAtNTcwNC04NDg0Iiwicm9sZSI6Imhvc3RzIiwiaWF0IjoxNzAwMTk2MjQ4LCJleHAiOjE3MDA5MTYyNDh9.djPth_b9BC8H8dNNpr3R0LnuUbC9pQ3oeYlihvzUwyA`;
    const res = await request(app)
      .get(`/schedules/${classId}`)
      .set('Authorization', `${token}`)
      .send();
  
    expect(res.body).toEqual({
      result: [
        {
          classDay: "2023-12-01 09:00",
          classHour: "2",
          enrolledMember: 0,
          id: 1,
          maxMember: 10,
          status: 1,
        },
        {
          classDay: "2023-12-02 09:00",
          classHour: "2",
          enrolledMember: 0,
          id: 2,
          maxMember: 10,
          status: 1,
        },
        {
          classDay: "2023-12-03 09:00",
          classHour: "2",
          enrolledMember: 0,
          id: 3,
          maxMember: 10,
          status: 1,
        },
      ],
    });
  
    expect(res.statusCode).toBe(200);
  });

});
//스케줄 등록해보기
describe("Post_New_Schedule", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });

  test("SUCCESS: 새 스케줄을 등록해보자", async () => {
    const classId = 1;
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsIm5hbWUiOiLstZzrr7zsp4AiLCJlbWFpbCI6ImFsc3dsODE4NEBuYXZlci5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTAtNTcwNC04NDg0Iiwicm9sZSI6Imhvc3RzIiwiaWF0IjoxNzAwMTk2MjQ4LCJleHAiOjE3MDA5MTYyNDh9.djPth_b9BC8H8dNNpr3R0LnuUbC9pQ3oeYlihvzUwyA`;
    const newScheduleData = {
      schedule_info: [
        { classDay: "2023-12-04 09:00", classHour: "2", maxMember: 10 },
        { classDay: "2023-12-05 09:00", classHour: "2", maxMember: 10 }
      ]
    };

    const res = await request(app)
      .post(`/schedules/${classId}`)
      .set('Authorization', `${token}`)
      .send(newScheduleData);
  
      expect(res.body.result).toEqual({
        message: "2 CREATE_SCHEDULES_SUCCESS",
        errors: []
      });
  
    expect(res.statusCode).toBe(200);
  });

});
//스케줄 업데이트 하기
describe("UPDATE_SCHEDULE", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });

  test("SUCCESS: 스케줄의 내용을 수정해보자", async () => {
    const scheduleId = 1;
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsIm5hbWUiOiLstZzrr7zsp4AiLCJlbWFpbCI6ImFsc3dsODE4NEBuYXZlci5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTAtNTcwNC04NDg0Iiwicm9sZSI6Imhvc3RzIiwiaWF0IjoxNzAwMTk2MjQ4LCJleHAiOjE3MDA5MTYyNDh9.djPth_b9BC8H8dNNpr3R0LnuUbC9pQ3oeYlihvzUwyA`;
    const updateData = {
      classDay: "2023-12-12 12:12",
      classHour: "3",
      maxMember: 15
    };

    const res = await request(app)
    .put(`/schedules/update/${scheduleId}`)
    .set('Authorization', `${token}`)
    .send(updateData);
  
    expect(res.body).toEqual({
      result: {
        message: "UPDATE_SCHEDULE_SUCCESS"
      }
    });
    expect(res.statusCode).toBe(200);
  });

});
//스케줄 삭제하기(hard)
describe("DELETE_SCHEDULE", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });

  test("SUCCESS: 스케줄을 삭제해보자", async () => {
    const scheduleId = 1;
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsIm5hbWUiOiLstZzrr7zsp4AiLCJlbWFpbCI6ImFsc3dsODE4NEBuYXZlci5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTAtNTcwNC04NDg0Iiwicm9sZSI6Imhvc3RzIiwiaWF0IjoxNzAwMTk2MjQ4LCJleHAiOjE3MDA5MTYyNDh9.djPth_b9BC8H8dNNpr3R0LnuUbC9pQ3oeYlihvzUwyA`;
    const res = await request(app)
      .delete(`/schedules/${scheduleId}`)
      .set('Authorization', `${token}`)
      .send();
  
    expect(res.body).toEqual({
      result: {
        message: "DELETE_SCHEDULE_SUCCESS"
      }
    });
  
    expect(res.statusCode).toBe(200);
  });

});