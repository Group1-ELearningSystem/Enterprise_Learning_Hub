import { findCoursesByInstructor, findFeedbacksByCourse, findCourseEarning, searchCoursesByTitle, insertCourseWithInstructor, updateCourseInformation } from "../repository/courseRepository.js";

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

export async function searchCourses(keyword) {
    const courses = await searchCoursesByTitle(keyword)
    return courses.map(c => ({
        id: c.Course_ID,
        title: c.Course_Name,
        overview: c.Course_Overview
    }))
}

export async function createCourse(course, instructorId){
    const courseId = await insertCourseWithInstructor(course, instructorId)
    return {
        courseId,
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

export async function updateCourses(course, courseId) {
    await updateCourseInformation(course, courseId)
    return {
        message: "Course updated successfully"
    }
}