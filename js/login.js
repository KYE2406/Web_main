import { session_set, session_set2, session_get_signup, session_get, session_get2, session_check } from './session.js';
import { encodeByAES256, decodeByAES256, encrypt_text, decrypt_text } from './crypto.js';
import { getAesKey, encryptText, decryptText } from './Crypto2.js';
import { generateJWT, verifyJWT, isAuthenticated, checkAuth } from './jwt_token.js';

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

async function decrypt_text2() {
  const encrypted = sessionStorage.getItem("Session_Storage_pass2");
  if (!encrypted) {
    console.log("암호화된 세션 값 없음");
    return;
  }
  const decrypted = await decryptText(encrypted); // Crypto2.js에 있는 함수
  console.log("복호화된 값:", decrypted);
}

async function init_logined() {
  if (!sessionStorage) {
    alert("세션 스토리지 지원 x");
    return;
  }

  // Web Crypto 복호화
  if (sessionStorage.getItem("Session_Storage_pass2")) {
    await decrypt_text2();
  }

  // CryptoJS 복호화
  if (sessionStorage.getItem("Session_Storage_pass")) {
    decrypt_text();
  }
}

function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
  const emailInput = document.getElementById('typeEmailX');
  const idsave_check = document.getElementById('idSaveCheck');
  const loginBtn = document.getElementById('login_btn');

  if (!emailInput || !idsave_check || !loginBtn) {
    // 로그인 페이지가 아닌 경우 (예: logout.html)
    return;
  }

  let get_id = getCookie("id");
  
  if(get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', check_input);
  }

  session_check(); // 세션 유무 검사
  displayLoginStatus();
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});

// 로그인 횟수 카운터
function login_count() {
    let count = parseInt(getCookie("login_cnt")) || 0;
    count++;
    setCookie("login_cnt", count, 7);
    console.log("로그인 횟수:", count);
}

// 로그아웃 횟수 카운터
function logout_count() {
  let count = parseInt(getCookie("logout_cnt")) || 0;
  count++;
  setCookie("logout_cnt", count, 30); // 30일 동안 유지 (원하는 기간으로 조절 가능)
  console.log("누적 로그아웃 횟수:", count);
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

const check_input = async () => {
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

  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');
  const idsave_check = document.getElementById('idSaveCheck');

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  const payload = {
    id: emailValue,
    exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
  };
  const jwtToken = generateJWT(payload);

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
  if (emailValue.length < 5 || emailValue.length > 30) {
    alert('이메일은 5자 이상 30자 이하로 입력해야 합니다.');
    return false;
  }

  const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).{8,15}$/;
  if (!pwRegex.test(passwordValue)) {
    alert('비밀번호는 8~15자이며, 대소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.');
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
await session_set2();
localStorage.setItem('jwt_token', jwtToken);
login_count();
loginForm.submit();
};

// 세션 삭제
function session_del() {
  if (sessionStorage) {
    sessionStorage.clear();
  } else {
    alert("세션 스토리지 지원 x");
  }
}

function logout() {
  localStorage.removeItem('jwt_token');
  session_del(); // 세션 삭제
  logout_count();
  alert('로그아웃 완료: 세션 스토리지와 토큰이 삭제되었습니다.');
  location.href = "../index.html"; // 로그아웃 후 메인 페이지로 이동
}

export { setCookie, setCookieMinutes, getCookie, getRemainingLockMinutes, displayLoginStatus, login_failed, reset_login_fail, decrypt_text2, init_logined, init, login_count, logout_count, check_xss, check_input, session_del, logout };