import { getAllCourses, getCourseById, createCourseForInstructor, getCoursesByInstructors, createCourse, updateCourses, searchCourses, getFeedbackForCourse, getCourseEarning, getCourseEarningDetails, getUnansweredQuestionService, submitAnswerService } from "../services/courseService.js";

export async function getAllCourseController(req, res) {
    try {
        const { page, limit } = req.query;
        const result = await getAllCourses(page, limit);
        res.json(result);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        });
    }
}

export async function getCourseByIdController(req, res) {
    try {
        const courseId = req.params.courseId
        const course = await getCourseById(courseId)
        res.json(course)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch course" })
    }
}

export async function getCoursesByInstructorsController(req, res) {
    try {
        const instructorId = req.params.id;
        const courses = await getCoursesByInstructors(instructorId)
        res.json(courses)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

export async function getCourseFeedbackController(req, res) {
    try {
        const courseId = req.params.courseId
        const page = parseInt(req.query.page) || 1
        const limit = 3
        const offset = (page - 1) * limit
        const feedbacks = await getFeedbackForCourse(courseId, limit, offset)
        res.json(feedbacks)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

export async function searchCourseController(req, res) {
    try {
        const { q } = req.query;
        const role = req.user.role;
        const instructorId = req.user.Instructor_ID;
        const courses = await searchCourses(q, role, instructorId);
        res.json(courses);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
}

export async function getCourseEarningController(req, res) {
    try {
        const { id } = req.params;
        const result = await getCourseEarning(id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getCourseEarningDetailsController(req, res) {
    try {
        const courseId = req.params.courseId
        const page = parseInt(req.query.page) || 1
        const limit = 3
        const offset = (page - 1) * limit
        const data = await getCourseEarningDetails(courseId, limit, offset)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" });
    }
}

export async function getUnansweredQuestionController(req, res) {
    try {
        const courseId = req.params.id
        const page = parseInt(req.query.page) || 1
        const questions = await getUnansweredQuestionService(courseId,page)
        res.status(200).json(questions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message:"Error fetching questions"});
    }
}

export async function createCoureController(req, res) {
    try {
        let instructorId
        if (req.user.role === "Instructor") {
            instructorId = req.user.Instructor_ID
        }

        if (req.user.role === "Employee") {
            instructorId = req.body.instructorId
        }

        const fieldName = req.body.fieldName
        const result = await createCourse(
            req.body,
            instructorId,
            fieldName
        )
        res.status(201).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to create course" })
    }
}

export async function updateCoureController(req, res) {
    try {
        const courseId = req.params.id
        const fieldName = req.body.fieldName
        const course = req.body
        await updateCourses(course, courseId, fieldName)
        res.json({ message: "Course updated" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Update failed" })
    }
}

export async function createCourseForInstructorController(req, res) {
    try {
        const { courseName, overview, objective, fee, status, instructorId, fieldName } = req.body
        const result = await createCourseForInstructor({
            courseName,
            overview,
            objective,
            fee,
            status,
            instructorId,
            fieldName
        })
        res.status(201).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: err.message
        })
    }
}

export async function answerQuestion(req, res) {
    try {
        const { questionId } = req.params
        const { answerText } = req.body
        await submitAnswerService(questionId, answerText)
        res.json({message: "Answer saved"})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({message: "Error saving answer"})
    }
}