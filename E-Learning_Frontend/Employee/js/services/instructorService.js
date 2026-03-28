import api from "../../../axios/axios.js";

export async function searchInstructors(keyword, token) {
    try {
        const res = await api.get(
            `/instructors/search?q=${keyword}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading instructors")
    }
}

export async function getInstructorById(id, token) {
    try {
        const res = await api.get(
            `/instructors/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log(res.data)
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading instructors")
    }
}

export async function getAllInstructors(token) {
    try {
        const res = await api.get(
            `/instructors`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        console.log(res.data)
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading instructors")
    }
}

export async function addInstructor(data, token) {
    try {
        const res = await api.post(
            "/instructors",
            data,
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        )
        return res.data
    } catch (err) {
        console.log(err)
        alert("Error adding new instructors")
    }
}

export async function updateInstructor(instructorId, status, token) {
    try {
        const res = await api.put(
            `/instructor/${instructorId}`,
            { status },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error updating instructors")
    }
}