const request = require("supertest");
const createApp = require("../app");
const { appDataSource } = require("../models/datasource");
const { setupDatabase, resetDatabase } = require('./testSetup');
const userToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbWUiOiLquYDrrLjsmIEiLCJlbWFpbCI6Im1uNTJpbEBuYXZlci5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTAtMTIzNC01NTU1Iiwicm9sZSI6InVzZXJzIiwiaWF0IjoxNzAwMTk2NDMwLCJleHAiOjE3MDA5MTY0MzB9.WVYdWKjcFjLTyFQdPEKhLsy-XcmUa1B-cNfEcr1WOeI`;
const hostToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsIm5hbWUiOiLstZzrr7zsp4AiLCJlbWFpbCI6ImFsc3dsODE4NEBuYXZlci5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTAtNTcwNC04NDg0Iiwicm9sZSI6Imhvc3RzIiwiaWF0IjoxNzAwMTk2MjQ4LCJleHAiOjE3MDA5MTYyNDh9.djPth_b9BC8H8dNNpr3R0LnuUbC9pQ3oeYlihvzUwyA`;
const adminToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW5faWQiOiJhZG1pbjExMDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTk5NTU1MDB9.MjN3UL4Ie0qnk2owFiqy0cONldqVNtbjFjZj9zJK6Ig`;
//모든 수업 가져오기(메인,강의리스트 페이지 등등)
describe("Get_all_classeslist", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: 모든 강의리스트를 가져오자", async () => {
    const res = await request(app)
      .get(`/classes/classeslist`)
      .send();
  
    expect(res.body).toEqual({
      result: {
        classList: [
          {
            id: 1,
            image_source: "main_image_source_1.jpg",
            name: "최민지",
            sub_category_name: "기타",
            summary: "테스트용",
            title: "테스트코드 작성해보기",
            top_category_name: "프로그래밍",
          },
          {
            id: 2,
            image_source: "main_image_source_2.jpg",
            name: "홍길동",
            sub_category_name: "명상",
            summary: "초급 요리",
            title: "초급자를 위한 요리 클래스",
            top_category_name: "디지털 마케팅",
          },
          {
            id: 3,
            image_source: "main_image_source_3.jpg",
            name: "김지수",
            sub_category_name: "고급 프로그래밍",
            summary: "디지털 마케팅",
            title: "디지털 마케팅 마스터하기",
            top_category_name: "자기계발",
          },
          {
            id: 4,
            image_source: "main_image_source_4.jpg",
            name: "박현우",
            sub_category_name: "예술사",
            summary: "명상과 자기계발",
            title: "자기계발을 위한 명상 클래스",
            top_category_name: "프로그래밍",
          },
          {
            id: 5,
            image_source: "main_image_source_5.jpg",
            name: "이서연",
            sub_category_name: "소셜 미디어 마케팅",
            summary: "고급 프로그래밍",
            title: "고급 프로그래밍 기술",
            top_category_name: "요리",
          },
          {
            id: 6,
            image_source: "main_image_source_6.jpg",
            name: "정태준",
            sub_category_name: "기타",
            summary: "예술사 이해",
            title: "예술사 강의",
            top_category_name: "예술",
          }
        ],
        subCategoriesName: [],
      }
    });
  
    expect(res.statusCode).toBe(200);
  });

});
//마감임박 수업 가져오기(메인 페이지))
describe("마감임박 수업의 스케줄 가져오기", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: 마감임박을 스케줄을 가져와보자", async () => {
    const res = await request(app)
      .get(`/classes/classeslist/upcomingclasses`)
      .send();
  
  expect(res.body).toEqual({
    message: {
      newProductOrder: [
        {
          id: 1,
          image_source: "main_image_source_1.jpg",
          name: "최민지",
          sub_category_name: "기타",
          summary: "테스트용",
          title: "테스트코드 작성해보기",
          top_category_name: "프로그래밍",
        },
        {
          id: 2,
          image_source: "main_image_source_2.jpg",
          name: "홍길동",
          sub_category_name: "명상",
          summary: "초급 요리",
          title: "초급자를 위한 요리 클래스",
          top_category_name: "디지털 마케팅",
        },
        {
          id: 3,
          image_source: "main_image_source_3.jpg",
          name: "김지수",
          sub_category_name: "고급 프로그래밍",
          summary: "디지털 마케팅",
          title: "디지털 마케팅 마스터하기",
          top_category_name: "자기계발",
        },
        {
          id: 4,
          image_source: "main_image_source_4.jpg",
          name: "박현우",
          sub_category_name: "예술사",
          summary: "명상과 자기계발",
          title: "자기계발을 위한 명상 클래스",
          top_category_name: "프로그래밍",
        },
        {
          id: 5,
          image_source: "main_image_source_5.jpg",
          name: "이서연",
          sub_category_name: "소셜 미디어 마케팅",
          summary: "고급 프로그래밍",
          title: "고급 프로그래밍 기술",
          top_category_name: "요리",
        }
      ],
      salesOrder: [
        {
          id: 1,
          image_source: "main_image_source_1.jpg",
          name: "최민지",
          sub_category_name: "기타",
          summary: "테스트용",
          title: "테스트코드 작성해보기",
          top_category_name: "프로그래밍",
        },
        {
          id: 2,
          image_source: "main_image_source_2.jpg",
          name: "홍길동",
          sub_category_name: "명상",
          summary: "초급 요리",
          title: "초급자를 위한 요리 클래스",
          top_category_name: "디지털 마케팅",
        },
        {
          id: 3,
          image_source: "main_image_source_3.jpg",
          name: "김지수",
          sub_category_name: "고급 프로그래밍",
          summary: "디지털 마케팅",
          title: "디지털 마케팅 마스터하기",
          top_category_name: "자기계발",
        },
        {
          id: 4,
          image_source: "main_image_source_4.jpg",
          name: "박현우",
          sub_category_name: "예술사",
          summary: "명상과 자기계발",
          title: "자기계발을 위한 명상 클래스",
          top_category_name: "프로그래밍",
        },
        {
          id: 5,
          image_source: "main_image_source_5.jpg",
          name: "이서연",
          sub_category_name: "소셜 미디어 마케팅",
          summary: "고급 프로그래밍",
          title: "고급 프로그래밍 기술",
          top_category_name: "요리",
        }
      ],
      upcomingClasses: [
        {
          class_day: "2023-12-01T00:00:00.000Z",
          class_hour: "2",
          id: 1,
          image_source: "main_image_source_1.jpg",
          name: "최민지",
          scheduleId: 1,
          sub_category_name: "기타",
          summary: "테스트용",
          title: "테스트코드 작성해보기",
          top_category_name: "프로그래밍",
        },
        {
          class_day: "2023-12-02T00:00:00.000Z",
          class_hour: "2",
          id: 1,
          image_source: "main_image_source_1.jpg",
          name: "최민지",
          scheduleId: 2,
          sub_category_name: "기타",
          summary: "테스트용",
          title: "테스트코드 작성해보기",
          top_category_name: "프로그래밍",
        },
        {
          class_day: "2023-12-03T00:00:00.000Z",
          class_hour: "2",
          id: 1,
          image_source: "main_image_source_1.jpg",
          name: "최민지",
          scheduleId: 3,
          sub_category_name: "기타",
          summary: "테스트용",
          title: "테스트코드 작성해보기",
          top_category_name: "프로그래밍",
        },
        {
          class_day: "2023-12-11T00:00:00.000Z",
          class_hour: "2",
          id: 2,
          image_source: "main_image_source_2.jpg",
          name: "홍길동",
          scheduleId: 4,
          sub_category_name: "명상",
          summary: "초급 요리",
          title: "초급자를 위한 요리 클래스",
          top_category_name: "디지털 마케팅",
        },
        {
          class_day: "2023-12-12T00:00:00.000Z",
          class_hour: "2",
          id: 3,
          image_source: "main_image_source_3.jpg",
          name: "김지수",
          scheduleId: 5,
          sub_category_name: "고급 프로그래밍",
          summary: "디지털 마케팅",
          title: "디지털 마케팅 마스터하기",
          top_category_name: "자기계발",
        }
      ],
    }
  });

  expect(res.statusCode).toBe(200);
    
  });

});
//수강생(user) 강의 리스트 가져오기 (유저 마이페이지))
describe("한 유저의 신청 강의리스트 가져오기", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: 내 강의리스트 불러오기 성공!", async () => {
    const res = await request(app)
      .get(`/classes/myclass`)
      .set('Authorization', `${userToken}`)
      .send();
  
      expect(res.body).toEqual({
        message: [
          {
            address: "서울특별시 강남구 테헤란로 427 (삼성동)",
            class_day: "2023-12-11T00:00:00.000Z",
            class_hour: "2",
            enrolled_member: 0,
            host_name: "홍길동",
            id: 2,
            image_source: "main_image_source_2.jpg",
            max_member: 10,
            order_id: 1,
            sub_category_name: "명상",
            summary: "초급 요리",
            title: "초급자를 위한 요리 클래스",
            top_category_name: "디지털 마케팅",
          },
          {
            address: "서울특별시 서초구 반포대로 123 (반포동)",
            class_day: "2023-12-12T00:00:00.000Z",
            class_hour: "2",
            enrolled_member: 0,
            host_name: "김지수",
            id: 3,
            image_source: "main_image_source_3.jpg",
            max_member: 10,
            order_id: 2,
            sub_category_name: "고급 프로그래밍",
            summary: "디지털 마케팅",
            title: "디지털 마케팅 마스터하기",
            top_category_name: "자기계발",
          }
        ]
      });

  expect(res.statusCode).toBe(200);
    
  });

});
//강사(host) 강의 리스트 가져오기 (호스트 마이페이지))
describe("한 강사의 수강 강의리스트 가져오기", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: 내 수업 불러오기 성공!", async () => {
    const res = await request(app)
      .get(`/classes/hostclass`)
      .set('Authorization', `${hostToken}`)
      .send();
  
  expect(res.body).toEqual({
    message: [
        {
            id: 1,
            title: "테스트코드 작성해보기",
            content: "테스트 코드를 만들어보는 내용입니다.",
            summary: "테스트용",
            price: "50000",
            top_category_name: "프로그래밍",
            sub_category_name: "기타",
            main_image_source: "main_image_source_1.jpg",
            sub_image_source: "sub_image_source_1.jpg",
            address: "서울특별시 강남구 테헤란로 427 (삼성동)",
            latitude: "37.506255",
            longitude: "127.053699",
            schedule_info: [
                {
                    schedule_id: 1,
                    class_day: "2023-12-01 09:00:00.000000",
                    class_hour: "2",
                    max_member: 10,
                    enrolled_member: 0,
                },
                {
                    schedule_id: 2,
                    class_day: "2023-12-02 09:00:00.000000",
                    class_hour: "2",
                    max_member: 10,
                    enrolled_member: 0,
                },
                {
                    schedule_id: 3,
                    class_day: "2023-12-03 09:00:00.000000",
                    class_hour: "2",
                    max_member: 10,
                    enrolled_member: 0,
                },
            ],
        },
    ],
});
    

  expect(res.statusCode).toBe(200);
    
  });

});
//선택된 강의의 상세정보 가져다 주기
describe("강의 상세정보 가져다줘보자!", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: 강의 상세정보 가져다주기 성공!", async () => {
    const classId = 1;
    const res = await request(app)
      .get(`/classes/${classId}`)
      .send();
  
  expect(res.body).toEqual({
    message: {
        id: 1,
        title: "테스트코드 작성해보기",
        content: "테스트 코드를 만들어보는 내용입니다.",
        summary: "테스트용",
        price: "50000",
        top_category_name: "프로그래밍",
        sub_category_name: "기타",
        main_image_source: "main_image_source_1.jpg",
        sub_image_source: "sub_image_source_1.jpg",
        address: "서울특별시 강남구 테헤란로 427 (삼성동)",
        latitude: "37.506255",
        longitude: "127.053699",
        hostId: 34,
        name: "최민지",
        schedule_info: [
            {
                schedule_id: 1,
                class_day: "2023-12-01 09:00:00.000000",
                class_hour: "2",
                max_member: 10,
                enrolled_member: 0,
            },
            {
                schedule_id: 2,
                class_day: "2023-12-02 09:00:00.000000",
                class_hour: "2",
                max_member: 10,
                enrolled_member: 0,
            },
            {
                schedule_id: 3,
                class_day: "2023-12-03 09:00:00.000000",
                class_hour: "2",
                max_member: 10,
                enrolled_member: 0,
            },
        ],
    },
});
    

  expect(res.statusCode).toBe(200);
    
  });

});
//새로운 강의 만들기
describe("새로운 강의를 만들어 보자!", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: 강의를 하나 만들어봤어!", async () => {
    const createData = {
      address: "서울특별시 강남구 테헤란로 427 (삼성동), 위워크타워 10층",
      title: "리그오브레전드 하루만에 브론즈 가기",
      summary: "채팅으로 팀원의 멘탈을 탄탄하게 만들어, 팀 합을 좋게 만들 수 있습니다.",
      content: "이 클래스에서는 리그 오브 레전드에서 브론즈 등급을 하루 만에 달성하는 방법을 배웁니다. 효과적인 채팅 전략으로 팀원들의 사기를 높이고, 팀의 조화를 극대화하는 방법을 중점적으로 다룰 예정입니다. 게임 플레이와 팀워크 스킬 향상에 초점을 맞춘 내용으로 구성됩니다.",
      price: 50000,
      topCategoryName: "예술",
      subCategoryName: "예술사",
      mainImageSource: "https://mayfly-bucket.s3.ap-northeast-2.amazonaws.com/game/%E1%84%87%E1%85%B3%E1%84%85%E1%85%A9%E1%86%AB%E1%84%8C%E1%85%B3.jpg",
      subImageSource: "https://mayfly-bucket.s3.ap-northeast-2.amazonaws.com/game/%E1%84%87%E1%85%B3%E1%84%85%E1%85%A9%E1%86%AB%E1%84%8C%E1%85%B32.jpg"
    };

    const res = await request(app)
      .post(`/classes/createclass`)
      .set('Authorization', `${hostToken}`)
      .send(createData);
  
    expect(res.body).toEqual({
      result: {
          message: "CREATE_CLASS_SUCCESS",
      },
    });
    

  expect(res.statusCode).toBe(200);
  });
});
//강의 삭제(soft)
describe("강의를 삭제해 보자", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: 강의를 삭제해버렸어!", async () => {
    const classId = 1;
    const res = await request(app)
      .put(`/classes/delete/${classId}`)
      .set('Authorization', `${hostToken}`)
      .send();
  
  expect(res.body).toEqual({
    message: {
        affectedRows: 1,
        changedRows: 1,
        fieldCount: 0,
        info: "Rows matched: 1  Changed: 1  Warnings: 0",
        insertId: 0,
        serverStatus: 2,
        warningStatus: 0,
    },
  });
    

  expect(res.statusCode).toBe(200);
  });
});
//강의 내용 수정하기
describe("강의를 수정해 보자!", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: 강의를 수정 했어!", async () => {
    const updateData = {
      address: "서울특별시 강남구 테헤란로 425 (삼성동)",
      title: "리그오브레전드 일주일만에 브론즈 가기",
      summary: "채팅으로 적팀의 멘탈을 흔들어,상대 팀 합을 안좋게 만들 수 있습니다.",
      content: "이 클래스에서는 리그 오브 레전드에서 브론즈 등급을 하루 만에 달성하는 방법을 배웁니다. 효과적인 채팅 전략으로 팀원들의 사기를 높이고, 팀의 조화를 극대화하는 방법을 중점적으로 다룰 예정입니다. 게임 플레이와 팀워크 스킬 향상에 초점을 맞춘 내용으로 구성됩니다.",
      price: 40000,
      topCategoryName: "예술",
      subCategoryName: "예술사",
      mainImageSource: "https://mayfly-bucket.s3.ap-northeast-2.amazonaws.com/game/%E1%84%87%E1%85%B3%E1%84%85%E1%85%A9%E1%86%AB%E1%84%8C%E1%85%B3.jpg",
      subImageSource: "https://mayfly-bucket.s3.ap-northeast-2.amazonaws.com/game/%E1%84%87%E1%85%B3%E1%84%85%E1%85%A9%E1%86%AB%E1%84%8C%E1%85%B32.jpg"
    };

    const classId = 1;
    const res = await request(app)
      .put(`/classes/update/${classId}`)
      .set('Authorization', `${hostToken}`)
      .send(updateData);
  
    expect(res.body).toEqual({
      message: {
        message: "UPDATE_CLASS_SUCCESS"
      }
    });
    

  expect(res.statusCode).toBe(200);
  });
});
//By Admin(모든 강의목록 조회)
describe("Get_all_classeslist_By_Admin", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS: soft 삭제된 강의 포함한 모든 강의리스트를 가져오자", async () => {
    
    const res = await request(app)
      .get(`/classes/admin/classeslist`)
      .set('Authorization', `${adminToken}`)
      .send();
  
  expect(res.body).toEqual({
    message: {
      result: [
        {
          deleted_at: null,
          host_name: "이서연",
          id: 5,
          sub_category_name: "소셜 미디어 마케팅",
          title: "고급 프로그래밍 기술",
          top_category_name: "요리",
        },
        {
          deleted_at: null,
          host_name: "홍길동",
          id: 2,
          sub_category_name: "명상",
          title: "초급자를 위한 요리 클래스",
          top_category_name: "디지털 마케팅",
        },
        {
          deleted_at: null,
          host_name: "김지수",
          id: 3,
          sub_category_name: "고급 프로그래밍",
          title: "디지털 마케팅 마스터하기",
          top_category_name: "자기계발",
        },
        {
          deleted_at: null,
          host_name: "최민지",
          id: 1,
          sub_category_name: "기타",
          title: "테스트코드 작성해보기",
          top_category_name: "프로그래밍",
        },
        {
          deleted_at: null,
          host_name: "박현우",
          id: 4,
          sub_category_name: "예술사",
          title: "자기계발을 위한 명상 클래스",
          top_category_name: "프로그래밍",
        },
        {
          deleted_at: null,
          host_name: "정태준",
          id: 6,
          sub_category_name: "기타",
          title: "예술사 강의",
          top_category_name: "예술",
        },
      ],
    },
  });
    
  
    expect(res.statusCode).toBe(200);
  });

});
//선택한 강의 삭제(soft By admin)
describe("DELETE_CLASS_BY_ADMIN", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS:선택한 강의를 soft 삭제해보자", async () => {
    const classId = 1;
    const res = await request(app)
      .put(`/classes/admin/delete/${classId}`)
      .set('Authorization', `${adminToken}`)
      .send();
  
    expect(res.body).toEqual({
      message: {
        affectedRows: 1,
        changedRows: 1,
        fieldCount: 0,
        info: "Rows matched: 1  Changed: 1  Warnings: 0",
        insertId: 0,
        serverStatus: 2,
        warningStatus: 0,
      }
    });
    
  
    expect(res.statusCode).toBe(200);
  });

});
//soft 삭제되어있는 강의 되살려주기
describe("REACTIVATE_CLASS_BY_ADMIN", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
    await appDataSource.query(`UPDATE classes SET deleted_at=NOW() WHERE id=1;`)
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });
  
  test("SUCCESS:soft 삭제되어있는 강의를 부활시키자", async () => {
    const classId = 1;
    const res = await request(app)
      .put(`/classes/admin/reactivate/${classId}`)
      .set('Authorization', `${adminToken}`)
      .send();
  
    expect(res.body).toEqual({
      message: {
        affectedRows: 1,
        changedRows: 1,
        fieldCount: 0,
        info: "Rows matched: 1  Changed: 1  Warnings: 0",
        insertId: 0,
        serverStatus: 2,
        warningStatus: 0,
      }
    });
    
  
    expect(res.statusCode).toBe(200);
  });

});