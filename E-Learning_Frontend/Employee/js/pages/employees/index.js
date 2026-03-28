import { setupEmployeeSearch } from "../../components/employees/employeeSearch.js"
import { attachEmployeeEvents, renderEmployeeCard } from "../../components/employees/employeeTable.js"
import { getAllEmployees } from "../../services/employeeService.js"

export async function employeeRender() {
    try {
        const tableBody = document.getElementById("employeeTable")
        const token = localStorage.getItem("token")
        const res = await getAllEmployees(token)

        tableBody.innerHTML = renderEmployeeCard(res)
        attachEmployeeEvents()
        setupEmployeeSearch((employee) => {
            const tableBody = document.getElementById("employeeTable")
            tableBody.innerHTML =
                renderEmployeeCard([employee])
        });

    } catch (err) {
        console.log(err)
        alert("Failed loading course")
    }
}