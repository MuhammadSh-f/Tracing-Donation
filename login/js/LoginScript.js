const IP = localStorage.getItem("IP");
function getpassword() {
  let Email = encodeURIComponent(
    document.getElementById("email").value
  ).toLowerCase();
  const url1 = `http://${IP}:3000/api/Doner/${Email}`;
  const xhr = new XMLHttpRequest(),
    method = "GET",
    url = url1;
  xhr.open(method, url, true);
  xhr.onreadystatechange = function () {
    // In local files, status is 0 upon success in Mozilla Firefox
    if (xhr.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let data = JSON.parse(xhr.responseText);
      if (data.length == 0) {
        alert("Enter Valid Email");
      } else {
        let x = data.password;
        let string1 = document.getElementById("pass").value;
        let result = string1.localeCompare(x);
        if (result == false) {
          const mail = document.getElementById("email").value.toLowerCase();
          localStorage.setItem("Email", mail);
          alert(`Hello ${data.Fname}`);
          location.replace("../index.html", "_self");
        } else {
          alert("Password invalid");
        }
      }
    }
  };
  xhr.send();
}
