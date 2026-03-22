import { findAllCourse, findCourseById, insertCourseWithInstructor, findCoursesByInstructor, findFeedbacksByCourse, findCourseEarning, searchCoursesByTitleEmployee, searchCoursesByTitleInstructor, updateCourseInformation } from "../repository/courseRepository.js";

export async function getAllCourses(page,limit) {
    page = Number(page) || 1;
    limit = Number(limit) || 6;

    const result = await findAllCourse(page, limit);
    const totalPages = Math.ceil(result.total / limit);
    return {
        courses: result.courses,
        total: result.total,
        page,
        totalPages
    };
}

export async function getCourseById(courseId) {
    const course = await findCourseById(courseId)
    return course
}

export async function getCoursesByInstructors(instructorId) {
    const course = await findCoursesByInstructor(instructorId) || []
    return course.map(c => ({
        id: c.Course_ID,
        title: c.Course_Name,
        overview: c.Course_Overview,
        objective: c.Course_Objective,
        fee: c.Course_Fee,
        status: c.Course_Status,
        avg_rating: c.avg_rating ? Number(c.avg_rating) : 0,
        total_reviews: c.total_reviews || 0
    }))
}

export async function getFeedbackForCourse(courseId, limit, offset){
    const feedbacks = await findFeedbacksByCourse(courseId, limit, offset)

    return feedbacks.map(f => ({
        id: f.Feedback_ID,
        learnerId: f.Learner_ID,
        learnerName: f.Learner_Full_Name,
        comment: f.Feedback_Comment,
        rating: f.Feedback_Rating,
        createdAt: f.Feedback_Created_At
    }))
}

export async function searchCourses(keyword, role, instructorId, page=1, limit=6) {
    let courses = []
    let total = 0
    if (role === "Instructor") {
        courses = await searchCoursesByTitleInstructor(keyword, instructorId);
    }
    else {
        courses = await searchCoursesByTitleEmployee(keyword);
    }

    return courses.map(c => ({
        id: c.Course_ID,
        title: c.Course_Name,
        overview: c.Course_Overview
    }));
}

export async function createCourse(course, instructorId, fieldName){
    const courseId = await insertCourseWithInstructor(course, instructorId, fieldName)
    return {
        courseId,
        message: "Course created successfully"
    }
}

export async function createCourseForInstructor(course) {
    if (!course.courseName) {
        throw new Error("Course name required")
    }

    if (!course.instructorId) {
        throw new Error("Instructor required")
    }

    if (!course.fieldName) {
        throw new Error("Field required")
    }

    const courseId = await insertCourseWithInstructor(course)

    return {
        id: courseId,
        message: "Course created successfully"
    }
}

export async function getCourseEarning(courseId) {
    const data = await findCourseEarning(courseId);

    if (!data) {
        return {
            total_subscribers: 0,
            total_earned: 0
        };
    }

    return {
        total_subscribers: data.total_subscribers || 0,
        total_earned: Number(data.total_earned || 0)
    };
}

export async function updateCourses(course, courseId, fieldName) {
    await updateCourseInformation(course, courseId, fieldName)
    return {
        message: "Course updated successfully"
    }
}