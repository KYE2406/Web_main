
import { checkAuth } from './jwt_token.js';
import { init_logined } from './login.js';
import { session_get_signup } from './session.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 조건: 로그인 필요한 페이지에서만 실행
  const isLoginRequired =
    location.pathname.includes('index_login.html') || // 예: 로그인 후 메인
    location.pathname.includes('dashboard.html');     // 또는 다른 보호된 페이지

  if (isLoginRequired) {
    checkAuth();         // 🔐 JWT 토큰 유효성 검사
    await init_logined(); // 🔓 WebCrypto 복호화
  }

  // 세션에서 복호화된 회원가입 정보 출력 (로그인 여부 관계없이)
  await session_get_signup();
});