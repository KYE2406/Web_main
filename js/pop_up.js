function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/" + ";SameSite=None; Secure";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for ( var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] == "popupYN") {
                return cookie_name[1];
            }
        }
    }
    return ;
}

function pop_up() {
    var cookieCheck = getCookie("popupYN");
    if (!cookieCheck || cookieCheck !== "N"){
    window.open("../popup/popup.html", "팝업테스트", "width=400, height=300, top=10, left=10");
    }
}

function closePopup() {
    if (document.getElementById('check_popup').value) {
        setCookie("popupYN", "N", 1);
        console.log("쿠키를 설정합니다.");
        self.close();
    }
}

function closePopup2() {
    self.close();
}

function show_clock() {
    const currentDate = new Date();
    const divClock = document.getElementById('divClock');

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    let hour = currentDate.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const hourStr = String(hour).padStart(2, '0');

    const minute = String(currentDate.getMinutes()).padStart(2, '0');
    const second = String(currentDate.getSeconds()).padStart(2, '0');

    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hourStr}:${minute}:${second} ${ampm}`;

    divClock.innerHTML = `${dateStr}<br>${timeStr}`;

    divClock.style.color = currentDate.getMinutes() > 58 ? "red" : "#222";

    setTimeout(show_clock, 1000);
}


    