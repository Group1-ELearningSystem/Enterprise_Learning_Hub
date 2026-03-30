import { loadPage } from "../../app.js";

export function renderInstructorCard(instructors) {
    return instructors.map(instructor =>
        `
        <tr>
                <td>
                    <div class="instructor-row">
                        <div class="avatar">
                            ${instructor.Instructor_Full_Name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <div>${instructor.Instructor_Full_Name}</div>
                            <small style="color:#888;">ID: ${instructor.Instructor_ID}</small>
                        </div>
                    </div>
                </td>
                <td>${instructor.Instructor_Email_Address}</td>
                <td>${instructor.Instructor_Phone_Number}</td>           
                <td>
                    <button class="update-btn" data-instructor-id="${instructor.Instructor_ID}">Update</button>
                </td>
            </tr>
        `
    ).join("");
}

export async function attachInstructorEvents(params) {
    const addingInstructorBtn = document.getElementById("addInstructorBtn")

    addingInstructorBtn.addEventListener("click", () => {
        loadPage("add_instructors")
    })

    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedInstructorId = btn.dataset.instructorId
            localStorage.setItem("selectedInstructorId", JSON.stringify(selectedInstructorId))
            loadPage("editting_instructors")
        })
    })
}