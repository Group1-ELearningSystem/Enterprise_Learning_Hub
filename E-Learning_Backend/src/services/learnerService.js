import { generateCode } from "../utils/id.js";
import { comparePasswordFlexible, hashPassword } from "../utils/password.js";
import { sendMailSafe } from "../utils/mailer.js";
import { pickRecommendedCourses } from "../utils/recommendation.js";

import * as learnerRepository from "../repository/learnerRepository.js";
import * as courseRepository from "../repository/courseLearnerRepository.js";
import * as subscriptionRepository from "../repository/subscriptionRepository.js";
import * as progressRepository from "../repository/progressRepository.js";
import * as videoTrackingRepository from "../repository/videoTrackingRepository.js";
import * as financialRequestRepository from "../repository/financialRequestRepository.js";
import * as feedbackRepository from "../repository/feedbackRepository.js";
import * as notificationRepository from "../repository/notificationRepository.js";

const ensureLearner = async (accountNumber) => {
  const learner = await learnerRepository.findLearnerByAccountNumber(accountNumber);

  if (!learner) {
    const error = new Error("Learner profile not found.");
    error.status = 404;
    throw error;
  }

  return learner;
};

const ensureCourse = async (courseId) => {
  const course = await courseRepository.findCourseById(courseId);

  if (!course) {
    const error = new Error("Course not found.");
    error.status = 404;
    throw error;
  }

  return course;
};

export const getProfile = async (accountNumber) => {
  const learner = await ensureLearner(accountNumber);

  return {
    learnerId: learner.Learner_ID,
    fullName: learner.Learner_Full_Name,
    email: learner.Learner_Email_Address,
    accountNumber: learner.Account_Number,
    username: learner.Account_Username,
    role: learner.Account_Roles,
    status: learner.Account_Status
  };
};

export const updateProfile = async (accountNumber, payload) => {
  const learner = await ensureLearner(accountNumber);
  const fullName = payload.fullName?.trim();

  if (!fullName) {
    const error = new Error("fullName is required.");
    error.status = 400;
    throw error;
  }

  await learnerRepository.updateLearnerProfile(accountNumber, fullName);

  return {
    message: "Profile updated successfully.",
    learnerId: learner.Learner_ID,
    fullName,
    email: learner.Learner_Email_Address
  };
};

export const changePassword = async (accountNumber, payload) => {
  const { oldPassword, newPassword, confirmPassword } = payload;

  if (!oldPassword || !newPassword || !confirmPassword) {
    const error = new Error("oldPassword, newPassword and confirmPassword are required.");
    error.status = 400;
    throw error;
  }

  if (newPassword !== confirmPassword) {
    const error = new Error("Confirm password does not match.");
    error.status = 400;
    throw error;
  }

  if (newPassword.length < 8) {
    const error = new Error("New password must have at least 8 characters.");
    error.status = 400;
    throw error;
  }

  const learner = await ensureLearner(accountNumber);

  const validOld = await comparePasswordFlexible(oldPassword, learner.Account_Password);
  if (!validOld) {
    const error = new Error("Old password is incorrect.");
    error.status = 400;
    throw error;
  }

  const isSame = await comparePasswordFlexible(newPassword, learner.Account_Password);
  if (isSame) {
    const error = new Error("New password must be different from old password.");
    error.status = 400;
    throw error;
  }

  const newHash = await hashPassword(newPassword);
  await learnerRepository.updateAccountPassword(accountNumber, newHash);

  return {
    message: "Password changed successfully.",
    learnerId: learner.Learner_ID
  };
};

export const getCourses = async ({ keyword, field, instructor, status = "AVAILABLE", learnerId }) => {
  return courseRepository.findCourses({ keyword, field, instructor, status, learnerId });
};

export const getCourseDetail = async (learnerId, courseId) => {
  const course = await ensureCourse(courseId);
  const subscription = learnerId
    ? await subscriptionRepository.findAnySubscription(learnerId, courseId)
    : null;

  const financialSupport = learnerId
    ? await financialRequestRepository.findApprovedFinancialSupport(learnerId, courseId)
    : null;

  const pendingRequest = learnerId
    ? await financialRequestRepository.findPendingFinancialRequest(learnerId, courseId)
    : null;

  return {
    course,
    isSubscribed: Boolean(subscription),
    subscriptionStatus: subscription?.Subscription_Status || null,
    effectiveFee: financialSupport ? Number(financialSupport.Request_Amount) : Number(course.Course_Fee || 0),
    financialSupport,
    hasPendingRequest: Boolean(pendingRequest)
  };
};

export const registerFreeCourse = async (accountNumber, courseId) => {
  const learner = await ensureLearner(accountNumber);
  const course = await ensureCourse(courseId);

  if (String(course.Course_Status).toUpperCase() !== "AVAILABLE") {
    const error = new Error("Course is not available for registration.");
    error.status = 400;
    throw error;
  }

  const existing = await subscriptionRepository.findAnySubscription(learner.Learner_ID, courseId);
  if (existing) {
    const error = new Error("You already registered this course.");
    error.status = 400;
    throw error;
  }

  const approvedSupport = await financialRequestRepository.findApprovedFinancialSupport(
    learner.Learner_ID,
    courseId
  );

  const effectiveFee = approvedSupport
    ? Number(approvedSupport.Request_Amount)
    : Number(course.Course_Fee || 0);

  if (effectiveFee > 0) {
    const error = new Error("This course is not free. Use the paid registration flow.");
    error.status = 400;
    throw error;
  }

  const subscriptionId = generateCode("SUB", 8);

  await subscriptionRepository.createSubscription({
    subscriptionId,
    status: "Active",
    learnerId: learner.Learner_ID,
    courseId
  });

  return {
    message: "Course registration successful.",
    subscriptionId,
    courseId,
    learnerId: learner.Learner_ID,
    status: "Active"
  };
};

// export const registerPaidCourse = async (accountNumber, courseId, paymentProof = null) => {
//   const learner = await ensureLearner(accountNumber);
//   const course = await ensureCourse(courseId);

//   const existing = await subscriptionRepository.findAnySubscription(learner.Learner_ID, courseId);
//   if (existing) {
//     const error = new Error("You already registered this course.");
//     error.status = 400;
//     throw error;
//   }

//   const subscriptionId = generateCode("SUB", 8);

//   await subscriptionRepository.createSubscription({
//     subscriptionId,
//     status: "Pending Verification",
//     learnerId: learner.Learner_ID,
//     courseId,
//     paymentProof
//   });

//   return {
//     message: "Paid course registration created. Waiting for verification.",
//     subscriptionId,
//     courseId,
//     learnerId: learner.Learner_ID,
//     fee: Number(course.Course_Fee || 0)
//   };
// };
export const registerPaidCourse = async (accountNumber, courseId, payload = {}) => {
  const learner = await ensureLearner(accountNumber);
  const course = await ensureCourse(courseId);

  if (String(course.Course_Status).toUpperCase() !== "AVAILABLE") {
    const error = new Error("Course is not available for registration.");
    error.status = 400;
    throw error;
  }

  const existing = await subscriptionRepository.findAnySubscription(learner.Learner_ID, courseId);
  if (existing) {
    const error = new Error("You already registered this course.");
    error.status = 400;
    throw error;
  }

  const approvedSupport = await financialRequestRepository.findApprovedFinancialSupport(
    learner.Learner_ID,
    courseId
  );

  const subscriptionId = generateCode("SUB", 8);

  // CASE 1: đã được duyệt hỗ trợ tài chính
  if (approvedSupport) {
    const password = payload.password?.trim();

    if (!password) {
      const error = new Error("Password is required to confirm approved financial registration.");
      error.status = 400;
      throw error;
    }

    const validPassword = await comparePasswordFlexible(
      password,
      learner.Account_Password
    );

    if (!validPassword) {
      const error = new Error("Password is incorrect.");
      error.status = 400;
      throw error;
    }

    await subscriptionRepository.createSubscription({
      subscriptionId,
      status: "Active",
      learnerId: learner.Learner_ID,
      courseId,
      paymentProof: approvedSupport.Request_Proof || null
    });

    await notificationRepository.createNotification({
      learnerId: learner.Learner_ID,
      type: "COURSE_REGISTRATION",
      title: "Course registration successful",
      message: `You have successfully enrolled in ${course.Course_Name} with approved financial support.`
    });

    return {
      message: "Course registration successful with approved financial support.",
      subscriptionId,
      courseId,
      learnerId: learner.Learner_ID,
      status: "Active",
      fee: Number(approvedSupport.Request_Amount || 0),
      usedFinancialSupport: true
    };
  }

  // CASE 2: chưa được duyệt hỗ trợ => flow paid bình thường
  const paymentProof = payload.paymentProof || null;

  await subscriptionRepository.createSubscription({
    subscriptionId,
    status: "Pending Verification",
    learnerId: learner.Learner_ID,
    courseId,
    paymentProof
  });

  return {
    message: "Paid course registration created. Waiting for verification.",
    subscriptionId,
    courseId,
    learnerId: learner.Learner_ID,
    fee: Number(course.Course_Fee || 0),
    usedFinancialSupport: false
  };
};

export const getMyCourses = async (accountNumber) => {
  await ensureLearner(accountNumber);
  return subscriptionRepository.findMyCoursesByAccountNumber(accountNumber);
};

export const getMyProgress = async (accountNumber) => {
  const learner = await ensureLearner(accountNumber);
  const rows = await progressRepository.findMyProgress(learner.Learner_ID);

  return rows.map((item) => ({
    ...item,
    progressPercentage: Number(item.totalSessions) > 0
      ? Number(((Number(item.completedSessions) / Number(item.totalSessions)) * 100).toFixed(2))
      : 0
  }));
};

export const getLearningContent = async (accountNumber, courseId) => {
  const learner = await ensureLearner(accountNumber);
  const subscription = await subscriptionRepository.findActiveSubscription(learner.Learner_ID, courseId);

  if (!subscription) {
    const error = new Error("You do not have an active subscription for this course.");
    error.status = 403;
    throw error;
  }

  const sessions = await courseRepository.findLearningSessionsByCourse(
    subscription.Subscription_ID,
    courseId
  );

  return {
    subscriptionId: subscription.Subscription_ID,
    courseId,
    sessions
  };
};

export const saveVideoProgress = async (accountNumber, courseId, sessionId, payload) => {
  const learner = await ensureLearner(accountNumber);
  const subscription = await subscriptionRepository.findActiveSubscription(learner.Learner_ID, courseId);

  if (!subscription) {
    const error = new Error("No active subscription found for this course.");
    error.status = 403;
    throw error;
  }

  const watchedSeconds = Number(payload.watchedSeconds || 0);
  const lastPositionSeconds = Number(payload.lastPositionSeconds || 0);
  const videoDurationSeconds = Number(payload.videoDurationSeconds || 0);

  await videoTrackingRepository.saveVideoTracking({
    subscriptionId: subscription.Subscription_ID,
    courseId,
    sessionId,
    watchedSeconds,
    lastPositionSeconds,
    videoDurationSeconds
  });

  const shouldComplete = videoDurationSeconds > 0 && watchedSeconds >= videoDurationSeconds * 0.9;
  if (shouldComplete) {
    await progressRepository.upsertProgress(subscription.Subscription_ID, courseId, sessionId, "Completed");
  }

  return {
    message: "Video progress saved.",
    completed: shouldComplete,
    watchedSeconds,
    lastPositionSeconds,
    videoDurationSeconds
  };
};

export const markSessionComplete = async (accountNumber, courseId, sessionId) => {
  const learner = await ensureLearner(accountNumber);
  const subscription = await subscriptionRepository.findActiveSubscription(learner.Learner_ID, courseId);

  if (!subscription) {
    const error = new Error("No active subscription found for this course.");
    error.status = 403;
    throw error;
  }

  const progressId = await progressRepository.upsertProgress(
    subscription.Subscription_ID,
    courseId,
    sessionId,
    "Completed"
  );

  return { message: "Session marked as completed.", progressId };
};

export const getExercises = async (accountNumber, courseId, sessionId) => {
  const learner = await ensureLearner(accountNumber);
  const subscription = await subscriptionRepository.findActiveSubscription(learner.Learner_ID, courseId);

  if (!subscription) {
    const error = new Error("No active subscription found for this course.");
    error.status = 403;
    throw error;
  }

  return courseRepository.findExercisesBySession(courseId, sessionId, false);
};

export const submitExercises = async (accountNumber, courseId, sessionId, answers = {}) => {
  const learner = await ensureLearner(accountNumber);
  const subscription = await subscriptionRepository.findActiveSubscription(learner.Learner_ID, courseId);

  if (!subscription) {
    const error = new Error("No active subscription found for this course.");
    error.status = 403;
    throw error;
  }

  const rows = await courseRepository.findExercisesBySession(courseId, sessionId, true);

  let correct = 0;
  const results = rows.map((item) => {
    const submitted = String(answers[item.Exercise_Number] || "").toUpperCase();
    const expected = String(item.Exercise_Answer || "").toUpperCase();
    const isCorrect = submitted && submitted === expected;
    if (isCorrect) correct += 1;

    return {
      exerciseNumber: item.Exercise_Number,
      question: item.Exercise_Question,
      submittedAnswer: submitted || null,
      correctAnswer: expected,
      isCorrect
    };
  });

  const total = rows.length;
  const score = total ? Number(((correct / total) * 100).toFixed(2)) : 0;
  const status = score >= 100 ? "Completed" : `${score}%`;

  await progressRepository.upsertProgress(subscription.Subscription_ID, courseId, sessionId, status);

  return {
    message: "Exercise submitted successfully.",
    total,
    correct,
    score,
    status,
    results
  };
};

export const createFinancialRequest = async (accountNumber, payload) => {
  const learner = await ensureLearner(accountNumber);
  const { courseId, supportPercent, reason, educationalBackground, employmentStatus, proof } = payload;

  if (!courseId || supportPercent === undefined) {
    const error = new Error("courseId and supportPercent are required.");
    error.status = 400;
    throw error;
  }

  const existing = await subscriptionRepository.findAnySubscription(learner.Learner_ID, courseId);
  if (existing?.Subscription_Status === "Active") {
    const error = new Error("You already have this course.");
    error.status = 400;
    throw error;
  }

  const pending = await financialRequestRepository.findPendingFinancialRequest(learner.Learner_ID, courseId);
  if (pending) {
    const error = new Error("You already have a pending financial request for this course.");
    error.status = 400;
    throw error;
  }

  const course = await ensureCourse(courseId);
  const percent = Number(supportPercent);

  if (percent < 0 || percent > 100) {
    const error = new Error("supportPercent must be between 0 and 100.");
    error.status = 400;
    throw error;
  }

  const requestAmount = Math.floor((Number(course.Course_Fee || 0) * percent) / 100);
  const requestId = generateCode("REQ", 10);

  await financialRequestRepository.createFinancialRequestRecord({
    requestId,
    requestAmount,
    proof,
    reason,
    educationalBackground,
    employmentStatus,
    learnerId: learner.Learner_ID,
    courseId
  });

  await sendMailSafe({
    to: learner.Learner_Email_Address,
    subject: "Financial request submitted",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Financial request submitted</h2>
        <p>Your request for course <strong>${course.Course_Name}</strong> has been recorded.</p>
        <ul>
          <li>Request ID: ${requestId}</li>
          <li>Requested support amount: ${requestAmount}</li>
          <li>Status: Pending</li>
        </ul>
      </div>`
  });

  return {
    message: "Financial request submitted successfully.",
    requestId,
    requestAmount,
    status: "Pending"
  };
};

export const getFinancialRequests = async (accountNumber) => {
  const learner = await ensureLearner(accountNumber);
  return financialRequestRepository.findFinancialRequestsByLearner(learner.Learner_ID);
};

export const getCourseFeedbacks = async (courseId) => {
  const items = await feedbackRepository.findCourseFeedbacks(courseId);
  const summary = await feedbackRepository.findFeedbackSummary(courseId);

  return { summary, items };
};

export const saveFeedback = async (accountNumber, courseId, payload) => {
  const learner = await ensureLearner(accountNumber);
  const subscription = await subscriptionRepository.findActiveSubscription(learner.Learner_ID, courseId);

  if (!subscription) {
    const error = new Error("Only enrolled learners can submit feedback.");
    error.status = 403;
    throw error;
  }

  const rating = Number(payload.rating);
  const comment = payload.comment?.trim() || null;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const error = new Error("rating must be an integer from 1 to 5.");
    error.status = 400;
    throw error;
  }

  const existing = await feedbackRepository.findLearnerFeedback(courseId, learner.Learner_ID);

  if (existing) {
    await feedbackRepository.updateFeedback(existing.Feedback_ID, comment, rating);
    return { message: "Feedback updated successfully.", feedbackId: existing.Feedback_ID };
  }

  await feedbackRepository.createFeedback(courseId, learner.Learner_ID, comment, rating);
  const feedbackId = await feedbackRepository.findLatestFeedbackId(courseId, learner.Learner_ID);

  return { message: "Feedback submitted successfully.", feedbackId };
};

export const saveReaction = async (accountNumber, courseId, payload) => {
  const learner = await ensureLearner(accountNumber);
  const subscription = await subscriptionRepository.findActiveSubscription(learner.Learner_ID, courseId);

  if (!subscription) {
    const error = new Error("Only enrolled learners can react to a course.");
    error.status = 403;
    throw error;
  }

  const reactionType = String(payload.reactionType || "").toUpperCase();
  if (!["LIKE", "DISLIKE"].includes(reactionType)) {
    const error = new Error("reactionType must be LIKE or DISLIKE.");
    error.status = 400;
    throw error;
  }

  await feedbackRepository.upsertCourseReaction(courseId, learner.Learner_ID, reactionType);

  return { message: `Course marked as ${reactionType}.` };
};

export const getNotifications = async (accountNumber) => {
  const learner = await ensureLearner(accountNumber);
  return notificationRepository.findNotificationsByLearner(learner.Learner_ID);
};

export const getRecommendations = async (accountNumber) => {
  const learner = await ensureLearner(accountNumber);

  const completed = await progressRepository.findCompletedCourseIds(learner.Learner_ID);
  const enrolled = await subscriptionRepository.findEnrolledCourseIds(learner.Learner_ID);
  const allCourses = await courseRepository.findAllAvailableCoursesForRecommendation();

  const suggestions = pickRecommendedCourses({
    completedCourseIds: completed.map((item) => item.Course_ID),
    enrolledCourseIds: enrolled.map((item) => item.Course_ID),
    currentField: null,
    allCourses
  });

  return {
    basedOnField: null,
    items: suggestions
  };
};

export const runInactiveLearningReminder = async () => {
  const learners = await progressRepository.findInactiveLearners();
  const results = [];

  for (const learner of learners) {
    const title = "We miss you in class";
    const message = `Hello ${learner.Learner_Full_Name}, you have not studied for a while. Come back and continue your learning journey.`;

    await notificationRepository.createNotification({
      learnerId: learner.Learner_ID,
      type: "REMINDER",
      title,
      message
    });

    await sendMailSafe({
      to: learner.Learner_Email_Address,
      subject: title,
      html: `<div style="font-family:Arial,sans-serif"><h2>${title}</h2><p>${message}</p></div>`
    });

    results.push({
      learnerId: learner.Learner_ID,
      email: learner.Learner_Email_Address
    });
  }

  return {
    message: "Reminder job executed.",
    totalLearners: results.length,
    learners: results
  };
};