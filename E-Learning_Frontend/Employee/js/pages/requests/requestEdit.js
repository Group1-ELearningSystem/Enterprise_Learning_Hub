import { updateRequest } from "../../services/requestService.js";

export function setupEditRequest(request) {
    document.getElementById("modalLearner").value = request.Learner_Full_Name
    document.getElementById("modalCourse").value = `${request.Course_Name} - ${request.Course_Fee}$`;
    document.getElementById("modalAmount").value = request.Request_Amount
    document.getElementById( "modalBackground").value = request.Request_Educational_Background
    document.getElementById("modalEmployment").value = request.Request_Employment_Status
    document.getElementById("modalReason").value = request.Request_Reason
    document.getElementById("modalStatus").value = request.Request_Status;
    document.getElementById("modalProof").src = `http://localhost:5000/${request.Request_Proof}`;

    const updateBtn = document.getElementById("updateStatusBtn");
    updateBtn.addEventListener("click", async () => {
        const status = document.getElementById("modalStatus").value
        try{
            const token = localStorage.getItem("token")
            await updateRequest(request.Request_ID, status, token)
            alert("Update Financial Request successfully")
        }catch(err){
            console.log(err)
            alert("Update Financial Request Failed")
        }
    })
}