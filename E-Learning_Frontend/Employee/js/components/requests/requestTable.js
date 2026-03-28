import { formatDate } from "../../../../utils/DateFormatUtils.js";
import { getRequestById } from "../../services/requestService.js";
import { setupEditRequest } from "../../pages/requests/requestEdit.js"

export function renderRequestTable(requests) {
    return requests.map(request =>
        `
            <tr>
                <td>${request.Request_ID}</td>
                <td>${request.Learner_Full_Name}</td>
                <td>${request.Course_Name}</td>
                <td>${formatDate(request.Request_Date)}</td>
                <td>${request.Request_Amount}</td>
                <td>
                    <span class="status-badge ${request.Request_Status === "Approved" ? "status-available" :
            request.Request_Status === "Processing" ? "status-pending" : "status-unavailable"
        }">
                        ${request.Request_Status}
                    </span>
                </td>

                <td class="text-end">
                    <button data-request-id="${request.Request_ID}" class="btn btn-sm btn-primary view-btn" 
                            data-bs-toggle="modal"
                            data-bs-target="#requestModal">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                </td>
            </tr>
        `
    ).join("");
}

export async function attachRequestEvent() {
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.requestId;
            const token = localStorage.getItem("token")
            const request = await getRequestById(id, token);
            setupEditRequest(request);
        });
    });
}