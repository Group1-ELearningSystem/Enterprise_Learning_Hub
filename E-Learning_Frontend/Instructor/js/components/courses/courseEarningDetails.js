import { formatDate } from "../../../../utils/DateFormatUtils.js";
import { formatMoney } from "../../../../utils/MoneyFormatUtils.js";

export function calculateTotals(items) {
    let totalFee = 0;
    let totalSystem = 0;
    let totalInstructor = 0;

    items.forEach(item => {
        totalFee += Number(item.Course_Fee);
        totalSystem += Number(item.system_fee);
        totalInstructor += Number(item.instructor_earning);
    });
    return {totalFee, totalSystem, totalInstructor};
}

export function renderEarningTable(items) {
    return items.map(item =>
        `
        <tr>
            <td>${item.Learner_Full_Name}</td>
            <td>
                ${formatDate(item.Subscription_Date)}
            </td>
            <td>$${formatMoney(item.Course_Fee)}</td>
            <td>$${formatMoney(item.system_fee)}</td>
            <td>
                <strong>
                    $${formatMoney(item.instructor_earning)}
                </strong>
            </td>
        </tr>
    `).join("");
}

export function renderEarningTotal(totals) {

    return `
        <tr class="total-row">
            <td colspan="2">
                <strong>TOTAL</strong>
            </td>

            <td>
                <strong>
                    ${formatMoney(totals.totalFee)}
                </strong>
            </td>

            <td>
                <strong>
                    ${formatMoney(totals.totalSystem)}
                </strong>
            </td>

            <td>
                <strong>
                    ${formatMoney(totals.totalInstructor)}
                </strong>
            </td>
        </tr>
    `;
}