const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../Ravi Expense Sheet - Aug 25.csv');
const OUTPUT_PATH = path.join(__dirname, '../FINANCE_REPORT.md');

function parseCurrency(str) {
    if (!str) return 0;
    // Handle "35*30" type calculations
    if (str.includes('*')) {
        const parts = str.split('*');
        return parts.reduce((acc, val) => acc * parseFloat(val), 1);
    }
    // Handle "20000+140000"
    if (str.includes('+')) {
        const parts = str.split('+');
        return parts.reduce((acc, val) => acc + parseFloat(val), 0);
    }
    return parseFloat(str.replace(/,/g, '')) || 0;
}

function analyzeFinance() {
    const content = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);

    const headers = lines[0].split(',');
    // Map months to indices (August is index 1, Sept is 2, etc.)
    const months = ['August', 'Sept', 'October', 'November', 'July', 'June', 'Nov', 'December'];

    const data = {
        expenses: {},
        income: {},
        debts: {},
        totals: { expense: 0, income: 0 }
    };

    let currentSection = 'expenses';

    lines.slice(1).forEach(line => {
        const cols = line.split(',');
        const category = cols[0]?.trim();

        if (!category) return;

        if (category === 'TOTAL') {
            months.forEach((m, i) => {
                const val = parseCurrency(cols[i + 1]);
                if (val) data.totals.expense += val;
            });
            return;
        }
        if (category === 'INCOME') {
            months.forEach((m, i) => {
                const val = parseCurrency(cols[i + 1]);
                if (val) data.totals.income += val;
            });
            return;
        }
        if (category === 'REMANING') return;

        // Heuristic to detect debt section (starts with Aman/Ashish/Rahul again around line 28)
        if (['Aman', 'Ashish sir', 'Rahul', 'Anil'].includes(category) && !data.expenses[category]) {
            // This might be debt tracking
        }

        // Standard Expense Row
        let rowTotal = 0;
        months.forEach((m, i) => {
            const val = parseCurrency(cols[i + 1]);
            rowTotal += val;
        });

        if (rowTotal > 0) {
            data.expenses[category] = (data.expenses[category] || 0) + rowTotal;
        }
    });

    // Sort expenses
    const sortedExpenses = Object.entries(data.expenses)
        .sort(([, a], [, b]) => b - a)
        .filter(([cat]) => !['TOTAL', 'INCOME', 'REMANING', 'Total'].includes(cat));

    const report = `
# 💰 Personal Finance Deep Dive

> **Analysis of:** \`Ravi Expense Sheet - Aug 25.csv\`
> **Period:** June - December (approx)

## 📊 Executive Summary

| Metric | Value |
| :--- | :--- |
| **Total Income Tracked** | ₹${data.totals.income.toLocaleString()} |
| **Total Expenses Tracked** | ₹${data.totals.expense.toLocaleString()} |
| **Net Status** | ${data.totals.income - data.totals.expense > 0 ? '✅ Surplus' : '⚠️ Deficit'} of ₹${Math.abs(data.totals.income - data.totals.expense).toLocaleString()} |

---

## 💸 Top Spending Categories

Where is the money going? Here are the biggest drains:

| Rank | Category | Total Spent | % of Total |
| :--- | :--- | :--- | :--- |
${sortedExpenses.slice(0, 8).map((([cat, val], i) =>
        `| #${i + 1} | **${cat}** | ₹${val.toLocaleString()} | ${((val / data.totals.expense) * 100).toFixed(1)}% |`
    )).join('\n')}

### 🔍 Key Observations
1.  **Debt Repayment**: A huge chunk goes to individuals (Aman, Ashish sir, Rahul) and loans (Kredit bee, Navi). This indicates a high debt burden.
2.  **Rent**: Significant recurring cost across "Pg rent" and "Lucknow rent".
3.  **Self/Lifestyle**: "self" and "card" expenses are notable.

---

## 📉 Debt & Liabilities

Based on the recurring names and loan entries:

*   **Formal Loans**: Navi Education loan, Kredit bee car loan.
*   **Informal Debts**: Aman, Rahul, Ashish sir.

> **Recommendation**: Prioritize clearing high-interest formal loans (Kredit bee usually has high rates) before informal family/friend debts if possible, unless interpersonal pressure is high.

---

## 💡 Recommendations

1.  **Consolidate Rent**: You are paying both "Pg rent" and "Lucknow rent" in some months. If possible, minimize this dual burden.
2.  **Track "Self"**: The category "self" is vague and high (₹${(data.expenses['self'] || 0).toLocaleString()}). Break this down to find leaks.
3.  **Emergency Fund**: With a tight surplus/deficit, building a small buffer is critical to avoid borrowing more from Aman/Rahul.

`;

    fs.writeFileSync(OUTPUT_PATH, report);
    console.log('Report generated at ' + OUTPUT_PATH);
}

analyzeFinance();
