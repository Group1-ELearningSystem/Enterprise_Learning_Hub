import * as learnerService from "../services/learnerService.js";

const accountNumberOf = (req) => req.user.accountNumber || req.user.Account_Number || req.user.account_number;
const learnerIdOf = (req) => req.user.learnerId || req.user.Learner_ID || req.user.learner_id;

export const getProfile = async (req, res, next) => {
  try {
    const data = await learnerService.getProfile(accountNumberOf(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await learnerService.updateProfile(accountNumberOf(req), req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const data = await learnerService.changePassword(accountNumberOf(req), req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const data = await learnerService.getCourses({
      keyword: req.query.keyword || req.query.name || "",
      field: req.query.field || "",
      instructor: req.query.instructor || "",
      status: req.query.status || "AVAILABLE",
      learnerId: learnerIdOf(req)
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCourseDetail = async (req, res, next) => {
  try {
    const data = await learnerService.getCourseDetail(learnerIdOf(req), req.params.courseId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const registerFreeCourse = async (req, res, next) => {
  try {
    const data = await learnerService.registerFreeCourse(accountNumberOf(req), req.params.courseId);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// export const registerPaidCourse = async (req, res, next) => {
//   try {
//     const data = await learnerService.registerPaidCourse(accountNumberOf(req), req.params.courseId, req.body.paymentProof);
//     res.status(201).json({ success: true, data });
//   } catch (error) {
//     next(error);
//   }
// };

export const registerPaidCourse = async (req, res, next) => {
  try {
    const data = await learnerService.registerPaidCourse(
      accountNumberOf(req),
      req.params.courseId,
      req.body
    );
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMyCourses = async (req, res, next) => {
  try {
    const data = await learnerService.getMyCourses(accountNumberOf(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMyProgress = async (req, res, next) => {
  try {
    const data = await learnerService.getMyProgress(accountNumberOf(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getLearningContent = async (req, res, next) => {
  try {
    const data = await learnerService.getLearningContent(accountNumberOf(req), req.params.courseId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const saveVideoProgress = async (req, res, next) => {
  try {
    const data = await learnerService.saveVideoProgress(accountNumberOf(req), req.params.courseId, req.params.sessionId, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const markSessionComplete = async (req, res, next) => {
  try {
    const data = await learnerService.markSessionComplete(accountNumberOf(req), req.params.courseId, req.params.sessionId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getExercises = async (req, res, next) => {
  try {
    const data = await learnerService.getExercises(accountNumberOf(req), req.params.courseId, req.params.sessionId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const submitExercises = async (req, res, next) => {
  try {
    const data = await learnerService.submitExercises(accountNumberOf(req), req.params.courseId, req.params.sessionId, req.body.answers || {});
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createFinancialRequest = async (req, res, next) => {
  try {
    const data = await learnerService.createFinancialRequest(accountNumberOf(req), req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getFinancialRequests = async (req, res, next) => {
  try {
    const data = await learnerService.getFinancialRequests(accountNumberOf(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCourseFeedbacks = async (req, res, next) => {
  try {
    const data = await learnerService.getCourseFeedbacks(req.params.courseId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const saveFeedback = async (req, res, next) => {
  try {
    const data = await learnerService.saveFeedback(accountNumberOf(req), req.params.courseId, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const saveReaction = async (req, res, next) => {
  try {
    const data = await learnerService.saveReaction(accountNumberOf(req), req.params.courseId, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const data = await learnerService.getNotifications(accountNumberOf(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const data = await learnerService.getRecommendations(accountNumberOf(req));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const runInactiveLearningReminder = async (_req, res, next) => {
  try {
    const data = await learnerService.runInactiveLearningReminder();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
