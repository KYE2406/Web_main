import { encodeByAES256, decodeByAES256, encrypt_text, decrypt_text } from './crypto.js';
import { getAesKey, encryptText, decryptText } from './Crypto2.js';

async function session_set(){ //세션 저장(객체)
    let id = document.querySelector("#typeEmailX");
    let password = document.querySelector("#typePasswordX");
    let random = new Date(); // 랜덤 타임스탬프
    const obj = { // 객체 선언
        id : id.value,
        otp : random
    }
    if (sessionStorage) {
        const objString = JSON.stringify(obj); // 객체 -> JSON 문자열 변환
        let en_text = await encrypt_text(objString); // 암호화
        sessionStorage.setItem("Session_Storage_id", id.value);
        sessionStorage.setItem("Session_Storage_object", objString);
        sessionStorage.setItem("Session_Storage_pass", en_text);
    } else {
        alert("세션 스토리지 지원 x");
    }
}

async function session_set2() {
  const pwInput = document.querySelector("#typePasswordX");
  if (!pwInput) {
    console.warn("비밀번호 입력란이 존재하지 않습니다.");
    return;
  }

  const pw = pwInput.value;
  const encrypted = await encryptText(pw);
  sessionStorage.setItem("Session_Storage_pass2", encrypted);
}

// 암호화된 회원가입 객체 저장
async function session_set_signup(signupObj) {
    const json = JSON.stringify(signupObj);
    const encrypted = await encryptText(json); // WebCrypto 사용
    sessionStorage.setItem("signup_data", encrypted);
}

// 복호화된 회원가입 객체 가져오기
async function session_get_signup() {
    const encrypted = sessionStorage.getItem("signup_data");
    if (!encrypted) {
        console.log("❌ 세션에 회원가입 정보가 없습니다.");
        return;
    }

    const decrypted = await decryptText(encrypted);
    try {
        const parsed = JSON.parse(decrypted);
        console.log("✅ 복호화된 회원가입 정보:", parsed);
    } catch (e) {
        console.error("❗ JSON 파싱 실패:", e);
    }
}

function session_get() { //세션 읽기
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass");
    } 
    else {
        alert("세션 스토리지 지원 x");
    }
}

function session_get2() {
    if (sessionStorage) {
        return sessionStorage.getItem("Session_Storage_pass2");
    } else {
        alert("세션 스토리지 지원 x");
    }
}

function session_check() { //세션 검사
    if (sessionStorage.getItem("Session_Storage_id")) {
     alert("이미 로그인 되었습니다.");
     location.href='../login/index_login.html'; // 로그인된 페이지로 이동
    }
}

export { session_set, session_set2, session_set_signup, session_get_signup, session_get, session_get2, session_check };