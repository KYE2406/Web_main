
import { checkAuth } from '/js/jwt_token.js';
import { init_logined } from '/js/login.js';
import { session_get_signup } from '/js/session.js';

document.addEventListener('DOMContentLoaded', async () => {
  const isLoginRequired = (
    location.pathname.includes('index_login.html') || 
    location.pathname.includes('dashboard.html') ||
    location.pathname.includes('profile.html')
  );

  if (isLoginRequired) {
    checkAuth();
    await init_logined();
  }

  // 세션에서 복호화된 회원가입 정보 출력 (로그인 여부 관계없이)
  await session_get_signup();
});