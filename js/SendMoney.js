const IP = localStorage.getItem("IP");
function makeid(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const Mid = makeid(2);
console.log(Mid);
function createasset() {
  const Pid = document.getElementById("project").value;
  const mo = document.getElementById("money").value;
  const email = localStorage.getItem("Email");
  const xhr = new XMLHttpRequest();

  xhr.open("POST", `http://${IP}:3000/api/CreateSendMoney`, true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/JSON");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      alert(`MoneyID Is: ${Mid}`);
    } else if (this.readyState === XMLHttpRequest.DONE && this.status === 500) {
      alert("Check Project ID and Try Again");
    }
  };
  let x = {
    $class: "org.block.money.net.CreateSendMoney",
    MId: Mid,
    Amount: Number(mo),
    donerId: `org.block.money.net.Doner#${email}`,
    pledgeId: `org.block.money.net.ProjectPledge#${Pid}`,
  };
  let myJSON = JSON.stringify(x);
  xhr.send(myJSON);
}

function myFunction() {
  createasset();
  localStorage.removeItem("donateId");
}

document.addEventListener("DOMContentLoaded", setIdValue);
function setIdValue() {
  const donateId = localStorage.getItem("donateId");
  console.log(donateId);
  if (donateId) {
    document.querySelector("#project").value = donateId;
  }
}
