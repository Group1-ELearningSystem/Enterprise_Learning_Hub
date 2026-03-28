import { searchEmployee } from "../../services/employeeService.js";
let selectedEmployeeId = null;

export function getSelectedEmployeeId() {
    return selectedEmployeeId;
}
function selectEmployee(employee, onSelect) {
    const input =document.getElementById("employeeSearch")
    const suggestionBox = document.getElementById("employeeSuggestions")
    input.value = `${employee.Employee_Full_Name} - (ID: ${employee.Employee_ID})`

    selectedEmployeeId = employee.Employee_ID
    suggestionBox.style.display = "none"

    if (onSelect) {
        onSelect(employee)
    }
}

async function searchEmployees(keyword, onSelect) {
    try {
        const token = localStorage.getItem("token")
        const res = await searchEmployee(keyword, token)
        renderEmployeeSuggestions(res,onSelect)
    } catch (err) {
        console.error(err)
    }
}

export function setupEmployeeSearch(onSelect = null) {
    const input = document.getElementById("employeeSearch")
    const suggestionBox = document.getElementById("employeeSuggestions")
    let debounceTimer

    input.addEventListener("input", () => {
        clearTimeout(debounceTimer)
        const keyword = input.value.trim()

        if (keyword.length < 2) {
            suggestionBox.style.display = "none"
            return
        }

        debounceTimer = setTimeout(() => {
            searchEmployees(keyword, onSelect)
        }, 400)
    })
}

function renderEmployeeSuggestions(employees, onSelect) {
    const suggestionBox = document.getElementById("employeeSuggestions")
    suggestionBox.innerHTML = ""
    if (employees.length === 0) {
        suggestionBox.style.display = "none"
        return
    }

    employees.forEach(employee => {
        const item = document.createElement("div")
        item.classList.add("suggestion-item")
        item.innerHTML = `
            <strong>
                ${employee.Employee_Full_Name}
            </strong>
            <br>

            <small>
                ID: ${employee.Employee_ID}
                | ${employee.Employee_Email_Address}
                | ${employee.Employee_Phone_Number}
            </small>
        `

        item.addEventListener("click", () => {
            selectEmployee(employee,onSelect)
        })
        suggestionBox.appendChild(item)
    })
    suggestionBox.style.display = "block"
}