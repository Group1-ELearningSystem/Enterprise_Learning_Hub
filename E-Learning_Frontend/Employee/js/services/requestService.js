import api from "../../../axios/axios.js";

export async function getRequests(token, filters = {}) {
    try {
        const params = new URLSearchParams()

        if (filters.search) params.append("search", filters.search)
        if (filters.status) params.append("status", filters.status)
        if (filters.date) params.append("date", filters.date)

        const res = await api.get(
            `/requests?${params}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error fetching requests")
    }
}

export async function getRequestById(id, token) {
    try {
        const res = await api.get(
            `/requests/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading requests")
    }
}

export async function updateRequest(id, status, token) {
    try {
        const res = await api.put(
            `/requests/${id}`,
            { status },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error updating requests")
    }
}