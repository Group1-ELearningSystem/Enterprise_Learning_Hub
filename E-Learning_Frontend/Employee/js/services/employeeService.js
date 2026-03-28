import api from "../../../axios/axios.js";

export async function searchEmployee(keyword, token) {
    try {
        const res = await api.get(
            `/employees/search?q=${keyword}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading employees")
    }
}

export async function getAllEmployees(token) {
    try {
        const res = await api.get(
            `/employees`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        console.log(res.data)
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading employees")
    }
}

export async function getEmployeeById(id, token) {
    try {
        const res = await api.get(
            `/employees/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error loading employee")
    }
}

export async function addEmployee(data, token) {
    try {
        const res = await api.post(
            "/employees",
            data,
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        )
        return res.data
    } catch (err) {
        console.log(err)
        alert("Error adding new employees")
    }
}

export async function updateEmployee(employeeId, status, token) {
    try {
        const res = await api.put(
            `/employees/${employeeId}`,
            { status },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error updating employees")
    }
}