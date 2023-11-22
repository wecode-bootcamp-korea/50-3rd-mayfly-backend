async function setupDB(appDataSource) {
  await appDataSource.query(`
    INSERT INTO users (id, name, email, phone_number, credit, deleted_at, updated_at, created_at)
    VALUES
      (1, '김철수', 'chulsoo.kim@example.com', '010-1234-5678', 1000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, '이영희', 'younghee.lee@example.com', '010-2345-6789', 1500, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, '박지민', 'jimin.park@example.com', '010-3456-7890', 500, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, '최서아', 'seoah.choi@example.com', '010-4567-8901', 2000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, '정다빈', 'dabin.jung@example.com', '010-5678-9012', 750, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (10, '김문영', 'mn52il@naver.com', '010-1234-1122', 43700, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `);

  await appDataSource.query(`
    INSERT INTO hosts (id, name, email, phone_number, credit, bank_account)
    VALUES 
      (1, '홍길동', 'gildong.hong@example.com', '010-1111-2222', 100, '123-123-123'),
      (2, '김지수', 'jisoo.kim@example.com', '010-1234-2345', 500, '234-567-890'),
      (3, '박현우', 'hyunwoo.park@example.com', '010-3456-4567', 1000, '345-678-901'),
      (4, '이서연', 'seoyeon.lee@example.com', '010-5678-6789', 750, '456-789-012'),
      (5, '정태준', 'taejun.jung@example.com', '010-7890-8901', 1200, '567-890-123'),
      (34, '최민지', 'alswl8184@naver.com', '010-1111-9999', 0, '123-456-789');
  `);

  await appDataSource.query(`
    INSERT INTO top_categories (id, name)
    VALUES (1, '요리'), (2, '디지털 마케팅'), (3, '자기계발'), (4, '프로그래밍'), (5, '예술');
  `);

  await appDataSource.query(`
    INSERT INTO sub_categories (id, name, top_category_id)
    VALUES (6, '기타', 4),(1, '초급 요리', 1), (2, '소셜 미디어 마케팅', 2), (3, '명상', 3), (4, '고급 프로그래밍', 4), (5, '예술사', 5);
  `);

  await appDataSource.query(`
    INSERT INTO places (id, address, latitude, longitude)
    VALUES 
      (1, '서울특별시 강남구 테헤란로 427 (삼성동)', 37.506255, 127.053699),
      (2, '서울특별시 서초구 반포대로 123 (반포동)', 37.503419, 127.005627),
      (3, '서울특별시 중구 소공로 100 (소공동)', 37.560738, 126.975473),
      (4, '경기도 성남시 분당구 판교로 200 (백현동)', 37.394564, 127.111198),
      (5, '서울특별시 마포구 월드컵북로 100 (상암동)', 37.568003, 126.898162);
  `);

  await appDataSource.query(`
    INSERT INTO classes (id, host_id, title, content, summary, price, top_category_id, sub_category_id, place_id)
    VALUES 
      (1, 34, '테스트코드 작성해보기', '테스트 코드를 만들어보는 내용입니다.', '테스트용', 50000.00, 4, 6, 1),
      (2, 1, '초급자를 위한 요리 클래스', '초급자를 대상으로 하는 쉽고 재미있는 요리 수업입니다.', '초급 요리', 30000.00, 2, 3, 1),
      (3, 2, '디지털 마케팅 마스터하기', '디지털 마케팅의 모든 것을 배울 수 있는 강의입니다.', '디지털 마케팅', 45000.00, 3, 4, 2),
      (4, 3, '자기계발을 위한 명상 클래스', '일상에서의 스트레스를 줄이고 마음의 평화를 찾는 방법을 배웁니다.', '명상과 자기계발', 20000.00, 4, 5, 3),
      (5, 4, '고급 프로그래밍 기술', '다양한 프로그래밍 언어와 고급 기술을 배울 수 있는 강의입니다.', '고급 프로그래밍', 55000.00, 1, 2, 4),
      (6, 5, '예술사 강의', '세계 예술사에 대한 깊이 있는 이해를 돕는 강의입니다.', '예술사 이해', 40000.00, 5, 6, 5);
  `);

  await appDataSource.query(`
    INSERT INTO schedules (id, class_day, class_id, class_hour, max_member, enrolled_member, status)
    VALUES 
      (1, '2023-12-01 09:00:00', 1, '2', 10, 0, 1),
      (2, '2023-12-02 09:00:00', 1, '2', 10, 0, 1),
      (3, '2023-12-03 09:00:00', 1, '2', 10, 0, 1),
      (4, '2023-12-11 09:00:00', 2, '2', 10, 0, 1),
      (5, '2023-12-12 09:00:00', 3, '2', 10, 0, 1);
  `);

  await appDataSource.query(`
    INSERT INTO images (name, image_source, class_id)
    VALUES
      ('main', 'main_image_source_1.jpg', 1),
      ('sub', 'sub_image_source_1.jpg', 1),
      ('main', 'main_image_source_2.jpg', 2),
      ('sub', 'sub_image_source_2.jpg', 2),
      ('main', 'main_image_source_3.jpg', 3),
      ('sub', 'sub_image_source_3.jpg', 3),
      ('main', 'main_image_source_4.jpg', 4),
      ('sub', 'sub_image_source_4.jpg', 4),
      ('main', 'main_image_source_5.jpg', 5),
      ('sub', 'sub_image_source_5.jpg', 5),
      ('main', 'main_image_source_6.jpg', 6),
      ('sub', 'sub_image_source_6.jpg', 6);
    `);

  await appDataSource.query(`
    INSERT INTO orders (user_id, class_id, schedule_id, quantity, email, status, created_at)
    VALUES
      (10, 2, 4, 1, 'mn52il@naver.com', 1, CURRENT_TIMESTAMP),
      (10, 3, 5, 1, 'mn52il@naver.com', 1, CURRENT_TIMESTAMP);
  `);

  await appDataSource.query(`
    INSERT INTO admins (id, admin_id, password) VALUES(1, 'admin1108','$2b$10$tk4j7zQuPFTXSCK5rQkc.O13fLI7wARDFqoqkXtlE3gxpt4FvaM/C');
  `);

  await appDataSource.query(`
  INSERT INTO likes (id, class_id, user_id) 
  VALUES
    (1,1,1),(2,2,2),(3,3,3),(4,1,4),(5,2,5),(6,2,4),(7,3,4),(8,5,4),(9,2,10);
  `);
}
async function resetDB(appDataSource) {
  await appDataSource.query(`SET foreign_key_checks = 0;`);
  await appDataSource.query(`TRUNCATE TABLE users`);
  await appDataSource.query(`TRUNCATE TABLE schedules;`);
  await appDataSource.query(`TRUNCATE TABLE classes;`);
  await appDataSource.query(`TRUNCATE TABLE places;`);
  await appDataSource.query(`TRUNCATE TABLE sub_categories;`);
  await appDataSource.query(`TRUNCATE TABLE top_categories;`);
  await appDataSource.query(`TRUNCATE TABLE hosts;`);
  await appDataSource.query(`TRUNCATE TABLE images;`);
  await appDataSource.query(`TRUNCATE TABLE orders;`);
  await appDataSource.query(`TRUNCATE TABLE admins;`);
  await appDataSource.query(`TRUNCATE TABLE likes;`);
  await appDataSource.query(`SET foreign_key_checks = 1;`);
  await appDataSource.destroy();
}

async function setupDatabase(appDataSource) {
  await appDataSource.query(`
    INSERT INTO users (id, name, email, phone_number, credit, deleted_at, updated_at, created_at)
    VALUES
      (1, '김철수', 'chulsoo.kim@example.com', '010-1234-5678', 1000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, '이영희', 'younghee.lee@example.com', '010-2345-6789', 1500, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, '박지민', 'jimin.park@example.com', '010-3456-7890', 500, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, '최서아', 'seoah.choi@example.com', '010-4567-8901', 2000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, '정다빈', 'dabin.jung@example.com', '010-5678-9012', 750, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (10, '김문영', 'mn52il@naver.com', '010-1234-1122', 43700, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    `);

  await appDataSource.query(`
    INSERT INTO hosts (id, name, email, phone_number, credit, bank_account)
    VALUES 
      (1, '홍길동', 'gildong.hong@example.com', '010-1111-2222', 100, '123-123-123'),
      (2, '김지수', 'jisoo.kim@example.com', '010-1234-2345', 500, '234-567-890'),
      (3, '박현우', 'hyunwoo.park@example.com', '010-3456-4567', 1000, '345-678-901'),
      (4, '이서연', 'seoyeon.lee@example.com', '010-5678-6789', 750, '456-789-012'),
      (5, '정태준', 'taejun.jung@example.com', '010-7890-8901', 1200, '567-890-123'),
      (34, '최민지', 'alswl8184@naver.com', '010-1111-9999', 0, '123-456-789');
  `);

  await appDataSource.query(`
    INSERT INTO top_categories (id, name)
    VALUES (1, '요리'), (2, '디지털 마케팅'), (3, '자기계발'), (4, '프로그래밍'), (5, '예술');
  `);

  await appDataSource.query(`
    INSERT INTO sub_categories (id, name, top_category_id)
    VALUES (6, '기타', 4),(1, '초급 요리', 1), (2, '소셜 미디어 마케팅', 2), (3, '명상', 3), (4, '고급 프로그래밍', 4), (5, '예술사', 5);
  `);

  await appDataSource.query(`
    INSERT INTO places (id, address, latitude, longitude)
    VALUES 
      (1, '서울특별시 강남구 테헤란로 427 (삼성동)', 37.506255, 127.053699),
      (2, '서울특별시 서초구 반포대로 123 (반포동)', 37.503419, 127.005627),
      (3, '서울특별시 중구 소공로 100 (소공동)', 37.560738, 126.975473),
      (4, '경기도 성남시 분당구 판교로 200 (백현동)', 37.394564, 127.111198),
      (5, '서울특별시 마포구 월드컵북로 100 (상암동)', 37.568003, 126.898162);
  `);

  await appDataSource.query(`
    INSERT INTO classes (id, host_id, title, content, summary, price, top_category_id, sub_category_id, place_id)
    VALUES 
      (1, 34, '테스트코드 작성해보기', '테스트 코드를 만들어보는 내용입니다.', '테스트용', 50000.00, 4, 6, 1),
      (2, 1, '초급자를 위한 요리 클래스', '초급자를 대상으로 하는 쉽고 재미있는 요리 수업입니다.', '초급 요리', 30000.00, 2, 3, 1),
      (3, 2, '디지털 마케팅 마스터하기', '디지털 마케팅의 모든 것을 배울 수 있는 강의입니다.', '디지털 마케팅', 45000.00, 3, 4, 2),
      (4, 3, '자기계발을 위한 명상 클래스', '일상에서의 스트레스를 줄이고 마음의 평화를 찾는 방법을 배웁니다.', '명상과 자기계발', 20000.00, 4, 5, 3),
      (5, 4, '고급 프로그래밍 기술', '다양한 프로그래밍 언어와 고급 기술을 배울 수 있는 강의입니다.', '고급 프로그래밍', 55000.00, 1, 2, 4),
      (6, 5, '예술사 강의', '세계 예술사에 대한 깊이 있는 이해를 돕는 강의입니다.', '예술사 이해', 40000.00, 5, 6, 5);
  `);

  await appDataSource.query(`
    INSERT INTO schedules (id, class_day, class_id, class_hour, max_member, enrolled_member, status)
    VALUES 
      (1, '2023-12-01 09:00:00', 1, '2', 10, 0, 1),
      (2, '2023-12-02 09:00:00', 1, '2', 10, 0, 1),
      (3, '2023-12-03 09:00:00', 1, '2', 10, 0, 1),
      (4, '2023-12-11 09:00:00', 2, '2', 10, 0, 1),
      (5, '2023-12-12 09:00:00', 3, '2', 10, 0, 1);
  `);

  await appDataSource.query(`
    INSERT INTO images (name, image_source, class_id)
    VALUES
      ('main', 'main_image_source_1.jpg', 1),
      ('sub', 'sub_image_source_1.jpg', 1),
      ('main', 'main_image_source_2.jpg', 2),
      ('sub', 'sub_image_source_2.jpg', 2),
      ('main', 'main_image_source_3.jpg', 3),
      ('sub', 'sub_image_source_3.jpg', 3),
      ('main', 'main_image_source_4.jpg', 4),
      ('sub', 'sub_image_source_4.jpg', 4),
      ('main', 'main_image_source_5.jpg', 5),
      ('sub', 'sub_image_source_5.jpg', 5),
      ('main', 'main_image_source_6.jpg', 6),
      ('sub', 'sub_image_source_6.jpg', 6);
    `);

  await appDataSource.query(`
    INSERT INTO orders (user_id, class_id, schedule_id, quantity, email, status, created_at)
    VALUES
      (10, 2, 4, 1, 'mn52il@naver.com', 1, CURRENT_TIMESTAMP),
      (10, 3, 5, 1, 'mn52il@naver.com', 1, CURRENT_TIMESTAMP);
  `);

  await appDataSource.query(`
    INSERT INTO admins (id, admin_id, password) VALUES(1, 'admin1108','$2b$10$tk4j7zQuPFTXSCK5rQkc.O13fLI7wARDFqoqkXtlE3gxpt4FvaM/C');
  `);
}

async function resetDatabase(appDataSource) {
  await appDataSource.query(`SET foreign_key_checks = 0;`);
  await appDataSource.query(`TRUNCATE TABLE users`);
  await appDataSource.query(`TRUNCATE TABLE schedules;`);
  await appDataSource.query(`TRUNCATE TABLE classes;`);
  await appDataSource.query(`TRUNCATE TABLE places;`);
  await appDataSource.query(`TRUNCATE TABLE sub_categories;`);
  await appDataSource.query(`TRUNCATE TABLE top_categories;`);
  await appDataSource.query(`TRUNCATE TABLE hosts;`);
  await appDataSource.query(`TRUNCATE TABLE images;`);
  await appDataSource.query(`TRUNCATE TABLE orders;`);
  await appDataSource.query(`TRUNCATE TABLE admins;`);
  await appDataSource.query(`SET foreign_key_checks = 1;`);
  await appDataSource.destroy();
}

module.exports = {
  setupDB,
  resetDB,
  setupDatabase,
  resetDatabase,
};
