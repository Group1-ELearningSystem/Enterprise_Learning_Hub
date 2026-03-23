import { loadAllFields } from "../../services/courseService.js"

export async function loadFields() {
    try {
        const token = localStorage.getItem("token")
        const res = await loadAllFields(token)
        const select = document.getElementById("empFieldSelect")

        select.innerHTML = ""
        res.forEach(field => {
            const option = document.createElement("option")
            option.value = field.Field_Name
            option.textContent = field.Field_Name
            select.appendChild(option)
        })
    } catch(err) {
        console.error(err)
    }
}