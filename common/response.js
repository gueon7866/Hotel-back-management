// common/response.js

// 성공 응답
export const successResponse = (res, data = null, message = "SUCCESS", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

// 에러 응답
export const errorResponse = (res, message = "ERROR", status = 500, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
