const IP = localStorage.getItem("IP");
let transactions = [];
const transactionContainer = document.getElementById("transaction-table");
function getHistory() {
  const xhr = new XMLHttpRequest(),
    method = "GET",
    url = `http://${IP}:3000/api/system/historian`;

  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    // In local files, status is 0 upon success in Mozilla Firefox
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let data = JSON.parse(xhr.responseText);
      for (let i = 0; i < data.length; i++) {
        transactions.push(data[i]);
        let transactiontype = transactions[i].transactionType.split(".")[4];
        switch (transactiontype) {
          case "CreateSendMoney":
            transactions[i].Participant = "Doner";
            break;
          case ("SendPledgeToGovernement", "CreateProjectPledge"):
            transactions[i].Participant = "Charity Organization";
            break;
          case "ApprovePledgeFromGovernement":
            transactions[i].Participant = "Government";
            break;
          default:
            transactions[i].Participant = "Admin";
            break;
        }
        transactionContainer.innerHTML = transactions
          .sort()
          .map((transaction) => {
            return `
          <tr>
            <td>${transaction.Participant}</td>
            <td>${transaction.transactionType.split(".")[4]}</td>
            <td>${new Date(transaction.transactionTimestamp)}</td>
            <td>${transaction.transactionId}</td>
          </tr>
          `;
          })
          .join("");
      }
      console.log(transactions);
    }
  };
  xhr.send();
}
function displayTransactions() {}
