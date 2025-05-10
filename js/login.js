// 아이디 저장
function setCookie(name, value, expiredays) {
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/" + ";SameSite=None; Secure";
}

// 로그인 실패 횟수 저장
function setCookieMinutes(name, value, minutes) {
  const d = new Date();
  d.setTime(d.getTime() + (minutes * 60 * 1000));
  document.cookie = escape(name) + "=" + escape(value) + "; expires=" + d.toUTCString() + "; path=/" + "; SameSite=None; Secure";
}

function getCookie(name) {
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for ( var index in cookie_array) {
            var cookie_name = cookie_array[index].split("=");
            if (cookie_name[0] === name) {
                return cookie_name[1];
            }
        }
    }
    return ;
}

// 로그인 제한 시간 계산 함수
function getRemainingLockMinutes() {
  const untilStr = getCookie("login_locked_until");
  if (!untilStr) return 0;

  const untilTime = parseInt(untilStr);  //
  if (isNaN(untilTime)) return 0;

  const now = Date.now();
  const diffMs = untilTime - now;
  const diffMin = Math.ceil(diffMs / (60 * 1000));
  return diffMin > 0 ? diffMin : 0;
}

// 로그인 상태 표시
function displayLoginStatus() {
  const failCount = parseInt(getCookie("login_fail_count")) || 0;
  const isLocked = getCookie("login_locked");
  const statusEl = document.getElementById("status");
  if (!statusEl) return;

  if (isLocked === "true") {
    const minutesLeft = getRemainingLockMinutes();
    statusEl.innerText = `${minutesLeft}분 후에 다시 시도해주세요.`;
  } else if (failCount > 0) {
    statusEl.innerText = `⚠ 현재 로그인 실패 횟수: ${failCount}회`;
  } else {
    statusEl.innerText = "";
  }
}

// 로그인 실패 처리
function login_failed() {
  const failCount = parseInt(getCookie("login_fail_count")) || 0;
  const isLocked = getCookie("login_locked");
  const statusEl = document.getElementById("status");

  if (isLocked === "true") {
    const minutesLeft = getRemainingLockMinutes();
    const msg = `${minutesLeft}분 후에 다시 시도해주세요.`;
    alert(msg);
    if (statusEl) statusEl.innerText = msg;
    return false;
  }

  const newCount = failCount + 1;
  setCookieMinutes("login_fail_count", newCount, 5);

  if (newCount >= 3) {
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + 5);
    setCookieMinutes("login_locked", "true", 5);
    setCookieMinutes("login_locked_until", lockUntil.getTime(), 5);
    alert("로그인 3회 이상 실패하여 5분간 로그인 제한됩니다.");
    if (statusEl) statusEl.innerText = "로그인 3회 이상 실패하여 5분간 로그인 제한됩니다.";
  } else {
    alert(`⚠ 로그인 실패 (${newCount}회). 3회 실패 시 로그인 제한됩니다.`);
    if (statusEl) statusEl.innerText = `⚠ 로그인 실패 (${newCount}회). 3회 실패 시 로그인 제한됩니다.`;
  }

  setTimeout(displayLoginStatus, 100);
  return true;
}

// 로그인 실패 초기화
function reset_login_fail() {
  setCookieMinutes("login_fail_count", "", -1);
  setCookieMinutes("login_locked", "", -1);
  setCookie("login_locked_until", "", -1);
}

function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
  const emailInput = document.getElementById('typeEmailX');
  const idsave_check = document.getElementById('idSaveCheck');
  let get_id = getCookie("id");
  if(get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
  }
  session_check(); // 세션 유무 검사
  displayLoginStatus();
}

// 로그인 횟수 카운터
function login_count() {
    let count = parseInt(getCookie("login_cnt")) || 0;
    count++;
    setCookie("login_cnt", count, 7);
    console.log("로그인 횟수:", count);
}

const check_xss = (input) => {
  // DOMPurify 라이브러리 로드 (CDN 사용)
  const DOMPurify = window.DOMPurify;
  // 입력 값을 DOMPurify로 sanitize
  const sanitizedInput = DOMPurify.sanitize(input);
  // Sanitized된 값과 원본 입력 값 비교
  if (sanitizedInput !== input) {
  // XSS 공격 가능성 발견 시 에러 처리
  alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
  return false;
  }
  // Sanitized된 값 반환
  return sanitizedInput;
};

const check_input = () => {
  const isLocked = getCookie("login_locked");
  if (isLocked === "true") {
    const minutesLeft = getRemainingLockMinutes();
    const msg = `로그인 제한 중입니다. ${minutesLeft}분 후 다시 시도해주세요.`;
    alert(msg);
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.innerText = msg;
    return false; // 폼 제출 차단
  }

  const loginForm = document.getElementById('login_form');
  const loginBtn = document.getElementById('login_btn');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');
  const idsave_check = document.getElementById('idSaveCheck');

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  // check_xss 함수로 이메일 Sanitize
  const sanitizedEmail = check_xss(emailValue);    
  // check_xss 함수로 비밀번호 Sanitize
  const sanitizedPassword = check_xss(passwordValue);  

  if (!sanitizedEmail) {
  // Sanitize된 이메일 사용
  return false;
  }

  if (!sanitizedPassword) {
  // Sanitize된 비밀번호 사용
  return false;
  }

  if (emailValue === '') {
    alert('이메일을 입력하세요.');
    return false;
  }

  if (passwordValue === '') {
    alert('비밀번호를 입력하세요.');
    return false;
  }

  // 글자 수 제한
  if (emailValue.length < 5 || emailValue.length > 10) {
    alert('이메일은 5자 이상 10자 이하로 입력해야 합니다.');
    return false;
  }

  if (passwordValue.length < 12 || passwordValue.length > 15) {
    alert('비밀번호는 12자 이상 15자 이하로 입력해야 합니다.');
    login_failed();
    return false;
  }

  const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
  if (!hasSpecialChar) {
  alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
  login_failed();
  return false;
  }

  const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
  const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
  if (!hasUpperCase || !hasLowerCase) {
  alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
  login_failed();
  return false;
  }

    // 3글자 이상 반복 금지 예: abcabc, 123123
  const repeatedPattern = /(.{3,})\1+/;
  if (repeatedPattern.test(emailValue) || repeatedPattern.test(passwordValue)) {
    alert('같은 문자열을 3글자 이상 반복해서 입력할 수 없습니다.');
    login_failed();
    return false;
  }

  // 2자리 숫자 반복 금지 예: 12아이디12
  const repeatedTwoDigitNumbers = /(\d{2})\D*\1+/;
  if (repeatedTwoDigitNumbers.test(emailValue) || repeatedTwoDigitNumbers.test(passwordValue)) {
    alert('같은 숫자 두 자리를 반복해서 입력할 수 없습니다.');
    login_failed();
    return false;
  }

  console.log('이메일:', emailValue);
  console.log('비밀번호:', passwordValue);

  // 검사 마무리 단계 쿠키 저장
  if (idsave_check.checked === true) {
    alert("쿠키를 저장합니다.");
    setCookie("id", emailValue, 1); // 1일 저장
    alert("쿠키 값: " + emailValue);
  } else {
    setCookie("id", "", 0);
  }

reset_login_fail();   // 🔧 성공 시 실패 횟수 초기화
session_set();
login_count();
loginForm.submit();
};

// 세션 삭제
function session_del() {
  if (sessionStorage) {
    sessionStorage.removeItem("Session_Storage_test");
    alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
  } else {
    alert("세션 스토리지 지원 x");
  }
}
function logout() {
  session_del(); // 세션 삭제
  location.href = "../index.html"; // 로그아웃 후 메인 페이지로 이동
}