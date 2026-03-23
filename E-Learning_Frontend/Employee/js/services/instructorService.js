import api from "../../../axios/axios.js";

/* ===============================
   SEARCH INSTRUCTORS
=============================== */
export async function searchInstructors(keyword, token) {
    try {
        const res = await api.get(
            `/instructors/search?q=${keyword}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading instructors")
    }
}