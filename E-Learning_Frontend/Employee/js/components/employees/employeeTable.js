import { formatDate } from "../../../../utils/DateFormatUtils.js";
import { loadPage } from "../../app.js";

export function renderEmployeeCard(employees) {
    return employees.map(employee =>
        `
        <tr>
                <td>
                    <div class="instructor-row">
                        <div class="avatar">
                            ${employee.Employee_Full_Name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <div>${employee.Employee_Full_Name}</div>
                            <small style="color:#888;">ID: ${employee.Employee_ID}</small>
                        </div>
                    </div>
                </td>
                <td>${employee.Employee_Email_Address}</td>
                <td>${employee.Employee_Phone_Number}</td>
                <td>${formatDate(employee.Employee_DOB)}</td>
                <td>${employee.Employee_Gender}</td>               
                <td>${employee.Employee_Address}</td>  
                <td>
                    <button class="update-btn" data-employee-id="${employee.Employee_ID}">Update</button>
                </td>
            </tr>
        `
    ).join("");
}

export function attachEmployeeEvents(params) {
    const addingEmployeeBtn = document.getElementById("addEmployeeBtn")

    addingEmployeeBtn.addEventListener("click", () => {
        loadPage("add_employees")
    })

    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedEmployeeId = btn.dataset.employeeId
            localStorage.setItem("selectedEmployeeId", JSON.stringify(selectedEmployeeId))
            loadPage("editting_employees")
        })
    })
}