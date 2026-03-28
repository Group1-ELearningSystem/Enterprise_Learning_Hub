import { getRequests } from "../../services/requestService.js";
import { attachRequestEvent } from "./requestTable.js";
import { renderRequestTable } from "./requestTable.js";

export function setupSearchFilter() {
    const searchInput = document.getElementById("requestSearch")
    const statusSelect = document.getElementById("requestStatus")
    const dateInput = document.getElementById("requestDate")

    async function applyFilter() {
        const token = localStorage.getItem("token");
        const filters = {
            search: searchInput.value,
            status: statusSelect.value,
            date: dateInput.value
        }

        const requests = await getRequests(token, filters)

        document.getElementById("requestTable").innerHTML = renderRequestTable(requests)
        attachRequestEvent();
    }

    searchInput.addEventListener("input", applyFilter)
    statusSelect.addEventListener("change",applyFilter)
    dateInput.addEventListener("change",applyFilter)
}