//// statusCode와 message만 입력하면 자동으로 에러를 던져주는 함수

const error = (statusCode, message) => {
    const err = new Error( message )
    err.statusCode = statusCode;
    throw err
}



module.exports = {
  error,
};

