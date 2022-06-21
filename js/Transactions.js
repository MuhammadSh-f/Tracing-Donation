const IP = localStorage.getItem("IP");
let transactions = [];
const transactionContainer = document.getElementById("transaction-table");
function getHistory() {
  const email = document.getElementById("Email").value;
  const fullId = `resource:org.block.money.net.Doner#${email}`;
  const xhr = new XMLHttpRequest(),
    method = "GET",
    url = `http://${IP}:3000/api/CreateSendMoney`;

  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    // In local files, status is 0 upon success in Mozilla Firefox
    if (xhr.readyState === XMLHttpRequest.DONE) {
      let data = JSON.parse(xhr.responseText);
      // console.log(data[0].Amount);
      for (let i = 0; i < data.length; i++) {
        if (data[i].donerId === fullId) {
          transactions.push(data[i]);
        }
      }
      console.log(transactions.length);
      displayTransactions();
    }
  };
  xhr.send();
}
function displayTransactions() {
  transactionContainer.innerHTML = transactions
    .sort((a, b) => a.pledgeId.split("#")[1] - b.pledgeId.split("#")[1])
    .map((transaction) => {
      return `
      <tr>
        <td>${transaction.MId}</td>
        <td>${transaction.Amount}</td>
        <td>${new Date(transaction.timestamp).toLocaleDateString()}</td>
        <td>${transaction.pledgeId.split("#")[1]}</td>
      </tr>
      `;
    })
    .join("");
}
