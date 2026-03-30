import api from "../../../axios/axios.js";

export async function getCourses(page = 1, limit = 6, token) {
    try {
        const res = await api.get(
            `/courses?page=${page}&limit=${limit}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading courses")
    }

}


/* ===============================
   SEARCH COURSES
=============================== */
export async function searchCourses(keyword, token) {
    try {
        const res = await api.get(
            `/courses/search?q=${keyword}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading courses")
    }

}


/* ===============================
   GET COURSE BY ID
=============================== */
export async function getCourseById(courseId, token) {
    try {
        const res = await api.get(
            `/courses/${courseId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error getting courses")
    }
}


/* ===============================
   CREATE COURSE
=============================== */
export async function createCourse(newCourse, token) {
    try {
        const res = await api.post(
            "/courses",
            newCourse,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error creating courses")
    }
}


/* ===============================
   UPDATE COURSE
=============================== */
export async function updateCourse(courseId, updatedCourse, token) {
    try {
        const res = await api.put(
            `/courses/${courseId}`,
            updatedCourse,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error updating courses")
    }
}


/* ===============================
   GET FEEDBACKS
=============================== */
export async function getCourseFeedbacks(courseId, page, token) {
    try {
        const res = await api.get(
            `/courses/${courseId}/feedbacks?page=${page}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading feedbacks")
    }

}


/* ===============================
   GET FIELDS
=============================== */
export async function loadAllFields(token) {
    try {
        const res = await api.get(
            "/fields",
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading fields")
    }
}
