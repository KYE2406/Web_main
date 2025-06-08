import { session_set_signup } from './session.js';

async function join(){ // 회원가입 기능
    let form = document.querySelector("#join_form"); // 로그인 폼 식별자
    let name = document.querySelector("#form3Example1c");
    let email = document.querySelector("#form3Example3c");
    let password = document.querySelector("#form3Example4c");
    let re_password = document.querySelector("#form3Example4cd");
    let agree = document.querySelector("#form2Example3c");

    const nameRegex = /^[가-힣]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]).{8,15}$/;
    const repeatedPattern = /(.{3,})\1+/;             // 3글자 이상 반복 금지
    const repeatedTwoDigitNumbers = /(\d{2})\D*\1+/;  // 같은 두 자리 숫자 반복 금지

    if (name.value.length === 0 || email.value.length === 0 || password.value.length === 0 || re_password.value.length === 0) {
    alert("회원가입 폼에 모든 정보를 입력해주세요.");
    return;
    }

    if (!nameRegex.test(name.value)) {
        alert("이름은 한글만 입력 가능합니다.");
        name.focus();
        return;
    }

    // 이메일 검사
    if (email.value.length < 5 || email.value.length > 30) {
        alert("이메일은 5자 이상 30자 이하로 입력해야 합니다.");
        email.focus();
        return;
    }

    if (!emailRegex.test(email.value)) {
        alert("이메일 형식이 올바르지 않습니다.");
        email.focus();
        return;
    }

    // 비밀번호 검사
    if (!pwRegex.test(password.value)) {
    alert("비밀번호는 8~15자이며, 대소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.");
    password.focus();
    return;
    }

    if (repeatedPattern.test(password.value)) {
        alert("같은 문자열을 3글자 이상 반복해서 입력할 수 없습니다.");
        password.focus();
        return;
    }

    if (repeatedTwoDigitNumbers.test(password.value)) {
        alert("같은 숫자 두 자리를 반복해서 입력할 수 없습니다.");
        password.focus();
        return;
    }

    if (password.value !== re_password.value) {
        alert("비밀번호가 일치하지 않습니다.");
        re_password.focus();
        return;
    }

    if (!agree.checked) {
        alert("약관에 동의하셔야 가입이 가능합니다.");
        return;
    }
    else {
        const newSignUp = new SignUp(name.value, email.value, password.value, re_password.value);
        const userInfo = newSignUp.getUserInfo(); // 순수 객체 추출

        try {
            session_set_signup(userInfo);
            alert("회원가입이 완료되었습니다.");  // 회원가입 알림
            form.submit(); // 제출
        } catch (e) {
            console.error("가입 오류:", e);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    }
}
document.getElementById("join_btn").addEventListener('click', join); // 이벤트 리스너

class SignUp {
    constructor(name, email, password, re_password) {
        // 생성자 함수: 객체 생성 시 회원 정보 초기화
        this._name = name;
        this._email = email;
        this._password = password;
        this._re_password = re_password;
    }
    // 전체 회원 정보를 한 번에 설정하는 함수
    setUserInfo(name, email, password, re_password) {
        this._name = name;
        this._email = email;
        this._password = password;
        this._re_password = re_password;
    }
    // 전체 회원 정보를 한 번에 가져오는 함수
    getUserInfo() {
        return {
            name: this._name,
            email: this._email,
            password: this._password,
            re_password: this._re_password
        };
    }
}
