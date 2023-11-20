const { appDataSource } = require("./datasource");

const getClassesList = async (topCategoryQuery,subCategoryQuery,searchQuery,orderingQuery,limit) =>{
  const result = await appDataSource.query(`
  SELECT
    c.id, c.title, c.summary, h.name AS name, i.image_source AS image_source,
    t.name AS top_category_name, s.name AS sub_category_name
  FROM
    classes c
  INNER JOIN (
    SELECT class_id, MIN(image_source) AS image_source
    FROM images
    WHERE name LIKE 'main'
    GROUP BY class_id ) i ON c.id = i.class_id
  JOIN top_categories t ON c.top_category_id = t.id
  JOIN sub_categories s ON c.sub_category_id = s.id
  JOIN hosts h ON c.host_id = h.id
  WHERE c.deleted_at IS NULL
  ${topCategoryQuery}
  ${subCategoryQuery}
  ${searchQuery}
  ${orderingQuery}
  ${limit}
  `);
  return result;
};
const getSubCategories = async(topCategoryName) =>{
  const query = 'SELECT id FROM top_categories WHERE name = ?'
  const getTopCategoryIdBySubCategoryName = await appDataSource.query(query,[topCategoryName])
  const query2= 'SELECT name FROM sub_categories WHERE top_category_id = ?'
  return await appDataSource.query(query2,[getTopCategoryIdBySubCategoryName[0].id]);
};
const getUpcomingClasses = async() => {
  const result = await appDataSource.query(`
  SELECT c.id, c.title,h.name,c.summary, s.class_day, s.class_hour, i.image_source AS image_source, s.id as scheduleId,
  t.name AS top_category_name, sc.name AS sub_category_name
  FROM classes c
  INNER JOIN schedules s ON c.id = s.class_id
  INNER JOIN images i ON c.id = i.class_id
  INNER JOIN top_categories t ON c.top_category_id = t.id
  INNER JOIN sub_categories sc ON c.sub_category_id = sc.id
  INNER JOIN hosts h ON c.host_id = h.id
  WHERE 
    c.deleted_at IS NULL AND s.status = 1 
  AND 
    s.class_day >= CURDATE() 
  AND
    i.name like 'main' AND s.max_member >= s.enrolled_member
  ORDER BY s.class_day ASC, TIME_FORMAT(s.class_day, '%H:%i:%s') ASC
  LIMIT 5
  `);
  return result;
};
const getClassDetailByClassId = async(classId) => {
  const result = await appDataSource.query(`
  SELECT 
  c.id, c.title, h.name, c.summary, c.content, c.price, t.name AS top_category_name, sb.name AS sub_category_name,c.host_id AS hostId,
  GROUP_CONCAT(
    JSON_OBJECT(
      'schedule_id', s.id,
      'class_day', s.class_day,
      'class_hour', s.class_hour,
      'max_member', s.max_member,
      'enrolled_member', s.enrolled_member
    )
  ) AS schedule_info,
  (SELECT i.image_source FROM images i WHERE i.class_id = c.id AND i.name = 'main' LIMIT 1) AS main_image_source,
  (SELECT i.image_source FROM images i WHERE i.class_id = c.id AND i.name = 'sub' LIMIT 1) AS sub_image_source,
  p.address, p.latitude, p.longitude
  FROM classes c
  LEFT JOIN schedules s ON c.id = s.class_id AND s.status = 1 AND s.class_day >= CURDATE() AND s.max_member >= s.enrolled_member
  INNER JOIN places p ON c.place_id = p.id
  INNER JOIN hosts h ON c.host_id = h.id
  INNER JOIN top_categories t ON c.top_category_id = t.id
  INNER JOIN sub_categories sb ON c.sub_category_id = sb.id
  WHERE 
    c.deleted_at IS NULL
  AND 
    c.id = ${classId}
  GROUP BY c.id, p.address, p.latitude, p.longitude
  ORDER BY MIN(s.class_day) ASC, MIN(s.class_hour) ASC;
  `)
  return result;
};
//지워진 것도 가져오게 하자.
const getUserClassesListByUserId = async(userId) => {
  const query = `
  SELECT 
    c.id, c.title, c.summary, 
    h.name AS host_name,
    i.image_source, 
    o.id AS order_id,
    s.class_day, s.class_hour, 
    s.enrolled_member, s.max_member, 
    p.address,
    tc.name AS top_category_name,
    sc.name AS sub_category_name
  FROM    
    orders o
    JOIN classes c ON o.class_id = c.id
    JOIN hosts h ON c.host_id = h.id
    LEFT JOIN images i ON c.id = i.class_id AND i.name = 'main'
    LEFT JOIN schedules s ON o.schedule_id = s.id
    LEFT JOIN places p ON c.place_id = p.id
    LEFT JOIN top_categories tc ON c.top_category_id = tc.id
    LEFT JOIN sub_categories sc ON c.sub_category_id = sc.id
  WHERE 
    o.user_id = ?
    AND o.deleted_at IS NULL
  `;
  return await appDataSource.query(query,[userId])
};
//지워진 건 안가져오게 함
const getHostClassesLisgByHostId= async(hostId) => {
  const query = `
  SELECT 
    c.id,c.title,c.summary,c.price,c.content,
    GROUP_CONCAT(
        JSON_OBJECT(
            'schedule_id', s.id,
            'class_day', s.class_day, 
            'class_hour', s.class_hour, 
            'max_member', s.max_member, 
            'enrolled_member', s.enrolled_member
        ) 
    ) AS schedule_info,
    (SELECT i.image_source FROM images i WHERE i.class_id = c.id AND i.name = 'main' LIMIT 1) AS main_image_source,
    (SELECT i.image_source FROM images i WHERE i.class_id = c.id AND i.name = 'sub' LIMIT 1) AS sub_image_source,
    tc.name AS top_category_name,
    sc.name AS sub_category_name,
    p.address, p.latitude, p.longitude
  FROM 
    classes c
    LEFT JOIN schedules s ON c.id = s.class_id
    LEFT JOIN top_categories tc ON c.top_category_id = tc.id
    LEFT JOIN sub_categories sc ON c.sub_category_id = sc.id
    LEFT JOIN places p ON c.place_id = p.id
  WHERE 
    c.host_id = 34 AND 
    c.deleted_at IS NULL
  GROUP BY 
    c.id, c.title, c.summary, c.price, tc.name, sc.name, p.address
  ORDER BY 
    c.title;
  `;
  return await appDataSource.query(query,[hostId]);
};
const findTopCategoryIdByName = async (topCategoryName,transaction) => {
  const query = `SELECT id FROM top_categories WHERE name = ?`;
  return await transaction.query(query, [topCategoryName]);
};
const findSubCategoryIdByName = async (subCategoryName, topCategoryId,transaction) => {
  const query = `SELECT id FROM sub_categories WHERE name = ? AND top_category_id = ?`;
  return await transaction.query(query, [subCategoryName, topCategoryId]);
};
const createPlace = async (address, latitude, longitude, transaction) => {
  const query = `
  INSERT INTO places 
    (address, latitude, longitude, created_at) 
  VALUES 
    (?, ?, ?, NOW())`;
  const placeResult = await transaction.query(query, [address, latitude, longitude]);
  return placeResult.insertId;
};
const createClass = async(host_id, title, summary, content, price, placeId, getTopCategoryId, getSubCategoryId, transaction) => {
  const query = `
  INSERT INTO classes
    (host_id, title, summary, content, price, sales, place_id, top_category_id, sub_category_id, created_at) 
  VALUES
    (?, ?, ?, ?, ?, 0, ?, ?, ?, NOW())`;
  const classResult = await transaction.query(query, [host_id, title, summary, content, price, placeId, getTopCategoryId, getSubCategoryId]);
  return classResult.insertId;
};
const createImage = async (classId, name, imageSource, transaction) => {
  const query = `
  INSERT INTO images
    (class_id, name, image_source)
  VALUES
    (?, ?, ?)`;
  const imageResult = await transaction.query(query, [classId, name, imageSource]);
  return imageResult;
};
const schedulesStatusCheckByclassId = async(classId) => {
  const query = `
  SELECT * 
  FROM schedules 
  WHERE 
    class_id = ? 
  AND 
    (status = 1 AND enrolled_member != 0)`;
  return await appDataSource.query(query,[classId]);
};
const deleteClassByClassId = async(classId) => {
  const query = `
  UPDATE classes 
  SET 
    deleted_at = CURRENT_TIMESTAMP 
  WHERE id = ?`
  return result = await appDataSource.query(query,[classId]);
};
const getPlaceIdByClassId = async(classId,transaction) => {
  const query = `SELECT place_id FROM classes WHERE id= ?`
  return await transaction.query(query,[classId]);
};
//업데이트
const modifyPlaces = async(getPlaceId,address,latitude,longitude,transaction) => {
  const query = `
  UPDATE places 
  SET
    address = ?,
    latitude = ?,
    longitude = ?
  WHERE id = ?`
  return await transaction.query(query,[address,latitude,longitude,getPlaceId])
};
const modifyClasses = async(classId,title,summary,content,price,getTopCategoryId,getSubCategoryId,transaction) => {
  const query = `
  UPDATE classes 
  SET 
    title = ?,
    summary = ?,
    content = ?,
    price = ?,
    top_category_id = ?,
    sub_category_id = ?
  WHERE id = ?`
  return await transaction.query(query,[title,summary,content,price,getTopCategoryId,getSubCategoryId,classId])
};
const modifyImages = async(imageSource,classId,name,transaction) => {
  const query = `
  UPDATE images 
  SET 
    image_source = ?
  WHERE 
    class_id = ? AND name = ?`
  return await transaction.query(query,[imageSource,classId,name])
};
const checkAdminByAdminId = async (adminId) => {
  const query = `SELECT * FROM admins WHERE admin_id= ?`
  return await appDataSource.query(query,[adminId]);
};
const reactivateClassByAdmin = async (classId) => {
  const query = `UPDATE classes SET deleted_at = NULL WHERE id = ?;`
  return result = await appDataSource.query(query,[classId]);
};

const allClassesListByAdmin = async () => {
  const query = `
  SELECT 
    classes.title, classes.id, classes.deleted_at,
    top_categories.name AS top_category_name,
    sub_categories.name AS sub_category_name,
    hosts.name AS host_name
  FROM 
    classes
    INNER JOIN top_categories ON classes.top_category_id = top_categories.id
    INNER JOIN sub_categories ON classes.sub_category_id = sub_categories.id
    INNER JOIN hosts ON classes.host_id = hosts.id;`
  return result = await appDataSource.query(query)
};

module.exports = {
  getClassesList,
  getSubCategories,
  getUpcomingClasses,
  getClassDetailByClassId,
  getUserClassesListByUserId,
  getHostClassesLisgByHostId,
  findTopCategoryIdByName,
  findSubCategoryIdByName,
  createPlace,
  createClass,
  createImage,
  schedulesStatusCheckByclassId,
  deleteClassByClassId,
  getPlaceIdByClassId,
  modifyPlaces,
  modifyClasses,
  modifyImages,
  checkAdminByAdminId,
  reactivateClassByAdmin,
  allClassesListByAdmin
};