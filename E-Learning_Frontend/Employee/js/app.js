// import { courseRender, LoadCourseToForm, openEditCourse, setupAddingEmployeeCourses } from "./courses.js"
import { courseRender } from "./pages/courses/index.js"
import { openEditCourse } from "./pages/courses/courseEdit.js"
import { setupAddingEmployeeCourses } from "./pages/courses/courseAdd.js"
import { employeeRender } from "./pages/employees/index.js"
import { setupAddingEmployee } from "./pages/employees/employeeAdd.js"
import { openEditEmployee } from "./pages/employees/employeeEdit.js"
// import { renderInstructor, setupAddingInstructor, setupEdittingInstructor } from "./instructors.js"
import { instructorRender } from "./pages/instructors/index.js"
// import { renderEmployee, setupAddingEmployee,setupEdittingEmployee } from "./employees.js"
import { openEditInstructor } from "./pages/instructors/instructorEdit.js"
import { setupAddingInstructor } from "./pages/instructors/instructorAdd.js"
import { renderRequests } from "./pages/requests/index.js"

const menuItems = document.querySelectorAll(".menu-item")
const pageContainer = document.getElementById("pageContainer")
const pageTitle = document.getElementById("pageTitle")
const logoutBtn = document.getElementById("logoutBtn")
const userEmail = document.getElementById("userEmail")

const loginUser = JSON.parse(localStorage.getItem("loginUser"))
userEmail.textContent = loginUser.email

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        const pageName = item.dataset.page
        if(!pageName) return

        menuItems.forEach(i => i.classList.remove("active"))
        item.classList.add("active")

        loadPage(pageName)
    })
})

logoutBtn.addEventListener("click", () => {
    const ok = confirm("Do you want to logout?");
    if (ok) {
        alert("You have logout");
        window.location.href="http://localhost:5173/"
        localStorage.removeItem("loginUser")
    }
})

export async function loadPage(pageName){
    try{
        const res = await fetch(`${pageName}.html`)
        const html = await res.text()

        pageContainer.innerHTML = html;

        const titleMap = {
            courses: "Course Management",
            instructors: "Instructor Management",
            employees: "Employee Management",
            requests: "Financial Requests"
        };
        pageTitle.textContent = titleMap[pageName] || "Dashboard";

        if(pageName === "courses"){
            courseRender();
        }

        if(pageName === "add_courses"){
            setupAddingEmployeeCourses()
        }

        if(pageName === "editting_courses"){
            const selectedCourseId = JSON.parse(localStorage.getItem("selectedCourseId"))
            openEditCourse(selectedCourseId)
        }

        if(pageName === "instructors"){
            instructorRender()
        }

        if(pageName === "add_instructors"){
            setupAddingInstructor()
        }

        if(pageName === "editting_instructors"){
            const selectedInstructorId = JSON.parse(localStorage.getItem("selectedInstructorId"))
            openEditInstructor(selectedInstructorId)
        }

        if(pageName === "employees"){
            employeeRender()
        }

        if(pageName === "add_employees"){
            setupAddingEmployee()
        }

        if(pageName === "editting_employees"){
            const selectedEmployeeId = JSON.parse(localStorage.getItem("selectedEmployeeId"))
            openEditEmployee(selectedEmployeeId)
        }

        if(pageName === "requests"){
            renderRequests()
        }

        if(pageName === "editting_requests"){
            const selectedRequestId = JSON.parse(localStorage.getItem("selectedRequestId"))
            setupEdittingRequest(selectedRequestId)
        }
    }catch(error){
        console.log(error);
        pageContainer.innerHTML = "<h4>Page not found</h4>";
    }
}

loadPage("courses")