import { importExercises } from "../../services/exerciseService.js"
import { loadPage } from "../../app.js"

export function setupExerciseImport() {
    const excelFile = document.getElementById("excelFile")
    const importBtn = document.getElementById("importExcelBtn")
    const importResult = document.getElementById("importResult")
    const backBtn = document.getElementById("backToExerciseBtn")

    const selectedSession = JSON.parse(localStorage.getItem("selectedSession"));

    backBtn.addEventListener("click", () => {
        loadPage("exercises")
    })

    importBtn.addEventListener("click", async () => {
        if (!excelFile.files.length) {
            alert("Please choose an Excel file first.");
            return;
        }

        const file = excelFile.files[0]

        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet -> JSON
        const rows = XLSX.utils.sheet_to_json(worksheet);

        const exercise = rows.map((row, index) => ({
            exerciseNo: index + 1,
            sessionId: selectedSession.sessionId,
            courseId: selectedSession.courseId,

            question: row.Question?.trim() || "",
            optionA: row.Option_A?.trim() || "",
            optionB: row.Option_B?.trim() || "",
            optionC: row.Option_C?.trim() || "",
            optionD: row.Option_D?.trim() || "",
            answer: row.Answer?.trim() || ""
        }))

        const invalid = exercise.find(ex => !ex.question || !ex.answer);
        if (invalid) {
            alert("Some exercises are missing Question or Answer. Please check the template.");
            return;
        }

        const token = localStorage.getItem("token")
        await importExercises(selectedSession.courseId, selectedSession.sessionId, exercise, token )
        importResult.innerHTML = `
            <div class="alert-success">
                Imported <b>${exercise.length}</b> exercises successfully
            </div> 
        `
    })
}