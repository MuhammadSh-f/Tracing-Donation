const IP = localStorage.getItem("IP");
function signUp() {
  const fn = document.getElementById("first_name").value;
  const ln = document.getElementById("last_name").value;
  const Em = document.getElementById("email").value.toLowerCase();
  const pn = document.getElementById("phone_number").value;
  const Pass = document.getElementById("password").value;
  const cno = document.getElementById("Creditcardno").value;
  const nid = document.getElementById("National ID").value;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `http://${IP}:3000/api/Doner`, true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/JSON");

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      alert("Registration Success");
      location.replace("./login.html");
    }
  };
  let x = {
    $class: "org.block.money.net.Doner",
    Fname: fn,
    Lname: ln,
    donerId: Em,
    PhoneNo: pn,
    password: Pass,
    creditCardNo: cno,
    nationalId: nid,
    sendMoney: [],
    projectPledge: [],
  };
  var myJSON = JSON.stringify(x);
  xhr.send(myJSON);
}
