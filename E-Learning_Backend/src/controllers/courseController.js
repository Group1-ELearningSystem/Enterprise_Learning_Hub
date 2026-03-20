import { getCoursesByInstructors, createCourse, updateCourses, searchCourses, getFeedbackForCourse, getCourseEarning } from "../services/courseService.js";

export async function getCoursesByInstructorsController(req, res) {
    try{
        const instructorId = req.params.id;
        const courses = await getCoursesByInstructors(instructorId)
        res.json(courses)
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Server error"})
    }
}

export async function getCourseFeedbackController(req, res){
    try{
        const courseId = req.params.courseId
        const page = parseInt(req.query.page) || 1
        const limit = 3
        const offset = (page - 1) * limit
        const feedbacks = await getFeedbackForCourse(courseId, limit, offset)
        res.json(feedbacks)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Server error"})
    }
}

export async function searchCourseController(req, res) {
    try {
        const keyword = req.query.q || ""
        if (!keyword.trim()) {
            return res.json([])
        }
        const results = await searchCourses(keyword)
        res.json(results)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
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

export async function createCoureController(req, res) {
    try{
        const instructorId = req.body.instructorId
        const courseId = await createCourse(req.body, instructorId)
        res.status(201).json(courseId)
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Failed to create course"})
    }
    
}

export async function updateCoureController(req,res) {
    try{
        const courseId = req.params.id;
        const course = req.body
        await updateCourses(course, courseId)
        res.json({message:"Course updated"})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Update failed"})
    }
}