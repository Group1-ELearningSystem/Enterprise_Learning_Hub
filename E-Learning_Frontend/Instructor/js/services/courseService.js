import api from "../../../axios/axios.js";

export async function getInstructorCourses(instructorId, token) {
    try {
        const res = await api.get(
            `/instructor/${instructorId}/courses`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return res.data || []
    } catch (err) {
        console.log(err)
        alert("Error fetching courses");
    }
}

export async function getCourseById(courseId, token) {
    try {
        const res = await api.get(
            `courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return res.data || []
    } catch (error) {
        console.log(err)
        alert("Error fetching courses");
    }
}

export async function createCourse(data, token) {
    try {
        return await api.post("/courses", data, {
            headers: { Authorization: `Bearer ${token}` }
        })
    } catch (error) {
        cconsole.log(err)
        alert("Error creating courses");
    }
}

export async function updateCourse(id, data, token) {
    try {
        return await api.put(`/courses/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
    } catch (error) {
        console.log(err)
        alert("Error updating courses");
    }
}

export async function getCourseFeedbacks(courseId, page, token) {
    try {
        const res = await api.get(
            `/courses/${courseId}/feedbacks?page=${page}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log(res);
        return res.data
    } catch (error) {
        console.log(err)
        alert("Error fetching feedbacks");
    }
}

export async function getCourseEarnings(courseId, token) {
    try {
        const res = await api.get(
            `/courses/${courseId}/earnings`,
            {
                headers: { Authorization: `Bearer ${token}` }
            })
        return res.data
    } catch (error) {
        console.log(err)
        alert("Error course earning");
    }
}

export async function getCourseEarningDetails(courseId, page, token) {
    try {
        const res = await api.get(
            `/courses/${courseId}/earning-details?page=${page}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        console.log(res);
        return await res.data
    } catch (err) {
        console.log(err)
        alert("Error course earning");
    }
}

export async function getUnansweredQuestion(courseId, page) {
    try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/questions/course/${courseId}/unanswered?page=${page}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        return res.data
    }
    catch (error) {
        console.log(error);
        alert("Error loading questions");
        return [];
    }
}

export async function submitAnswer(questionId, answerText) {
    try {
        const token = localStorage.getItem("token")
        await api.put(`/questions/${questionId}/answer`,
            {
                answerText
            },
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        )
        return true
    }
    catch (error) {
        console.log(error)
        alert("Error submitting answer")
        return false
    }
}

export async function loadAllFields(token) {
    try {
        const res = await api.get(
            `/fields`,
            {
                headers: { Authorization: `Bearer ${token}` }
            })
        return res.data
    } catch (error) {
        console.log(err)
        alert("Error loading fields");
    }
}
