const classesDao = require("../models/classesDao");
const { error } = require("../middleware/error");
const { appDataSource } = require("../models/datasource");
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getClassesList = async (topCategoryName, subCategoryName, sortBy, search) => {
  const ordering = async (sortBy) => {
    const sortOptions = {
      salesDesc: "ORDER BY c.sales DESC, c.id ASC",
      newest: "ORDER BY c.created_at DESC, c.id ASC",
      default: "ORDER BY c.id ASC",
    };
    return sortOptions[sortBy] || sortOptions.default;
  };
  const orderingQuery = await ordering(sortBy);
  const searchQuery = search ? `AND (c.title like '%${search}%' OR c.content like '%${search}%')` : "";
  const topCategoryQuery = topCategoryName ? `AND t.name = '${topCategoryName}'` : "";
  const subCategoryQuery = subCategoryName ? `AND s.name = '${subCategoryName}' AND t.name = '${topCategoryName}'` : "";
  const limit = "";

  const result = await classesDao.getClassesList(
    topCategoryQuery,
    subCategoryQuery,
    searchQuery,
    orderingQuery,
    limit
  );

  let result2 = [];
  if (topCategoryName) {
    result2 = await classesDao.getSubCategories(topCategoryName);
  };

  return { classList: result, subCategoriesName: result2 };
};

const getUpcomingClasses = async() =>{
  const salesDesc = "ORDER BY c.sales DESC, c.id ASC";
  const newest = "ORDER BY c.created_at DESC, c.id ASC";
  const limit = 'LIMIT 5'
  
  const salesOrder = await classesDao.getClassesList('', '', '', salesDesc, limit);
  const newProductOrder = await classesDao.getClassesList('', '', '', newest, limit);
  const upcomingClasses = await classesDao.getUpcomingClasses();
  return { salesOrder, newProductOrder, upcomingClasses }
};

const getClassDetail = async(classId) => {
  const [result] = await classesDao.getClassDetailByClassId(classId);
  const scheduleInfoString = result.schedule_info;
  const cleanedScheduleInfoString = scheduleInfoString.replace(/\//g, '');
  let scheduleInfoArray = [];

  if (cleanedScheduleInfoString) {
    try {
      scheduleInfoArray = JSON.parse(`[${cleanedScheduleInfoString}]`);
    } catch (error) {
      console.error('스케줄 정보 파싱 오류:', error);
    }
  }
  const structuredData = { ...result, schedule_info: scheduleInfoArray };
  return structuredData;  
};

const getMyClassesList = async(userId) =>{
  const result = await classesDao.getUserClassesListByUserId(userId);
  return result;
};

const getHostClassesList = async(hostId) => {
  const result = await classesDao.getHostClassesLisgByHostId(hostId);
  const result2 = [];
  for (let i = 0; i < result.length; i++) {
    const scheduleInfoString = result[i].schedule_info;
    const cleanedScheduleInfoString = scheduleInfoString.replace(/\//g, '');
    let scheduleInfoArray = [];
    if (cleanedScheduleInfoString) {
      try {
        scheduleInfoArray = JSON.parse(`[${cleanedScheduleInfoString}]`);
      } catch (error) {
        console.error('스케줄 정보 파싱 오류:', error);
      };
    };
    const structuredData = { ...result[i], schedule_info: scheduleInfoArray };
    result2.push(structuredData);
  };
return result2;
};  

const createClass = async(hostId, address, title, summary, content, price, topCategoryName, subCategoryName, mainImageSource, subImageSource) => {
  try {   
    if(!address || !title || !summary || !content || !price || !topCategoryName || !subCategoryName || !mainImageSource || !subImageSource){
      error(400, 'ALL_FIELDS_MUST_BE_FILLED');
    };
    const placeAddress = encodeURIComponent(address);
    const axiosResult = await axios.get(`${process.env.KAKAO_ADDRESS_URL}${placeAddress}`, {
        headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
        }
    });     
    const latitude = axiosResult.data.documents[0].address.y;
    const longitude = axiosResult.data.documents[0].address.x;

     // 트랜잭션을 사용하는 부분 ㅠㅠ
    await appDataSource.transaction(async transaction => {
      //카테고리 name으로 id 찾아오기
      const [ topCategoryResult ] = await classesDao.findTopCategoryIdByName(topCategoryName, transaction);
      if (!topCategoryResult || topCategoryResult.length === 0) {
        error(400,'TOP_CATEGORY_NOT_FOUND');
      };  
      const getTopCategoryId = topCategoryResult.id;
      const [ subCategoryResult ] = await classesDao.findSubCategoryIdByName(subCategoryName, getTopCategoryId, transaction);
      if (!subCategoryResult || subCategoryResult.length === 0) {
        error(400,'SUB_CATEGORY_NOT_FOUND');
      };
      const getSubCategoryId = subCategoryResult.id;
      //순차적으로 저장 시작
      const placeId = await classesDao.createPlace(address, latitude, longitude, transaction);
      const classId = await classesDao.createClass(hostId, title, summary, content, price, placeId, getTopCategoryId, getSubCategoryId, transaction);
      await classesDao.createImage(classId, 'main', mainImageSource, transaction);
      await classesDao.createImage(classId, 'sub', subImageSource, transaction);
    });

    return { message: "CREATE_CLASS_SUCCESS" };
  } catch (err) {
    console.error(err);
    throw err; 
  };
};

const deleteClass = async(hostId, classId)=>{
  const [compareByHostId] = await classesDao.getClassDetailByClassId(classId);
  //강의의 강사와 토큰의 강사의 id가 일치하는지 검증
  if(compareByHostId.hostId !== hostId){
    error(400,'USER_DOES_NOT_MATCH');
  }; 
  const checkSchedulesStatus = await classesDao.schedulesStatusCheckByclassId(classId);
  if(checkSchedulesStatus.length>0){
    error(400,'CANNOT_DELETE_CLASS_AS_SCHEDULES_ENROLLED_MEMBER');
  };
  const result = await classesDao.deleteClassByClassId(classId);
  return result;
};

const updateClass = async(hostId, classId, address, title, summary, content, price, topCategoryName, subCategoryName, mainImageSource, subImageSource) => {
  try{
    const [compareByHostId] = await classesDao.getClassDetailByClassId(classId);
    //강의의 강사와 토큰의 강사의 id가 일치하는지 검증
    if(compareByHostId.hostId !== hostId){
      error(400,'USER_DOES_NOT_MATCH');
    };    
    if(!address || !title || !summary || !content || !price || !topCategoryName || !subCategoryName || !mainImageSource || !subImageSource){
      error(400, 'ALL_FIELDS_MUST_BE_FILLED');
    };
    const placeAddress = encodeURIComponent(address);
    const axiosResult = await axios.get(`${process.env.KAKAO_ADDRESS_URL}${placeAddress}`, {
        headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
        }
    });     
    const latitude = axiosResult.data.documents[0].address.y;
    const longitude = axiosResult.data.documents[0].address.x;
  
    await appDataSource.transaction(async transaction => {
      //카테고리 name 으로 id 찾기
      const topCategoryResult = await classesDao.findTopCategoryIdByName(topCategoryName, transaction);
      if (!topCategoryResult || topCategoryResult.length === 0) {
        error(400,'TOP_CATEGORY_NOT_FOUND');
      };
      const getTopCategoryId = topCategoryResult[0].id;
      const subCategoryResult = await classesDao.findSubCategoryIdByName(subCategoryName, getTopCategoryId, transaction);
      if (!subCategoryResult || subCategoryResult.length === 0) {
        error(400,'SUB_CATEGORY_NOT_FOUND');
      };
      const getSubCategoryId = subCategoryResult[0].id;
      //해당 class에서 place_id 값 가져오기
      const placeIdResult = await classesDao.getPlaceIdByClassId(classId, transaction);
      const getPlaceId = placeIdResult[0].place_id;
      //places 테이블 수정
      await classesDao.modifyPlaces(getPlaceId, address, latitude, longitude, transaction);
      //classes 테이블 수정
      await classesDao.modifyClasses(classId, title, summary, content, price, getTopCategoryId, getSubCategoryId, transaction);
      //images 테이블 수정
      await classesDao.modifyImages(mainImageSource, classId, 'main', transaction)
      await classesDao.modifyImages(subImageSource, classId, 'sub', transaction)
    });
    return { message: "UPDATE_CLASS_SUCCESS" };
  } catch(err) {
    console.error(err);
    throw err; 
  };
};

const deleteClassByAdmin = async(adminId, classId) => {
  const checkAdmin = await classesDao.checkAdminByAdminId(adminId);
  if(checkAdmin.length === 0){
    error(400,"USER_DOES_NOT_MATCH");
  };
  const result = await classesDao.deleteClassByClassId(classId);
  return result;
};

const reactivateClassByAdmin = async(adminId, classId) => {
  const checkAdmin = await classesDao.checkAdminByAdminId(adminId);
  if(checkAdmin.length === 0){
    error(400,"USER_DOES_NOT_MATCH");
  };
  const result = await classesDao.reactivateClassByAdmin(classId);
  return result;
};

const allClassesListByAdmin = async(adminId) => {
  const checkAdmin = await classesDao.checkAdminByAdminId(adminId);
  if(checkAdmin.length === 0){
    error(400,"USER_DOES_NOT_MATCH");
  };
  const result = await classesDao.allClassesListByAdmin();
  return { result };
};

module.exports = {
  getClassesList,
  getUpcomingClasses,
  getClassDetail,
  getMyClassesList,
  getHostClassesList,
  createClass,
  deleteClass,
  updateClass,
  deleteClassByAdmin,
  reactivateClassByAdmin,
  allClassesListByAdmin
};