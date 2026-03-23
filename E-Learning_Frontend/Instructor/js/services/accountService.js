import api from "../../../axios/axios.js";

export async function updateAccount(accountNumber, oldPassword, newPassword, token) {
    try {
        const res = await api.post(
            "/change-password",
            {
                accountNumber,
                oldPassword,
                newPassword
            },
            { headers: { Authorization: `Bearer ${token}`}} 
        )

        return res.data
    } catch (err) {
        console.log(err)
        alert("Error updating account ")
    }
}