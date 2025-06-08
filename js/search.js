//검색창 애니메이션
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("search_button_msg");
  const searchInput = document.getElementById("search_input");
  const wrapper = document.querySelector(".search-wrapper");
  const closeBtn = document.getElementById("close_btn");

  let expanded = false;

  searchBtn.addEventListener("click", function () {
    if (!expanded) {
      searchInput.classList.add("show");
      wrapper.classList.add("expanded");
      expanded = true;
      setTimeout(() => searchInput.focus(), 300);
    } else {
      searchInput.classList.remove("show");
      wrapper.classList.remove("expanded");
      expanded = false;
    }
  });

  closeBtn.addEventListener("click", function () {
    if (searchInput.value.trim() !== "") {
      // 입력값이 있을 때: 입력값 삭제
      searchInput.value = "";
      searchInput.focus(); // 다시 입력 가능하도록 포커스 유지
    } else {
      // 입력값이 없을 때: 창 닫기
      searchInput.classList.remove("show");
      wrapper.classList.remove("expanded");
      expanded = false;
    }
  });
});

  
//검색 시 구글로 이동
document.getElementById("search_button_msg").addEventListener('click', search_message);

function search_message() {
  let msg = "검색을 수행합니다 (1)";
  console.log(msg);
}

// 두 번째 같은 이름 함수 (의도적 중첩 - 후속 선언)
function search_message() {
  let msg = "검색을 수행합니다 (2)";
  console.log(msg);
}

function googleSearch() {
    const searchInput = document.getElementById("search_input")
    const searchTerm = searchInput.value.trim(); // 앞뒤 공백 제거

    // 1. 입력이 없거나 공백만 있으면 중단
    if (searchTerm.length === 0) {
        alert("검색어를 입력해주세요.");
        return false;
    }

    // 2. 비속어 배열 정의
    const bannedWords = ["바보", "멍청이", "미친", "죽어", "꺼져"];

    // 3. 비속어 검사
    for (let i = 0; i < bannedWords.length; i++) {
        if (searchTerm.includes(bannedWords[i])) {
            alert("부적절한 단어가 포함되어 있습니다.");
            return false;
        }
    }

    // 4. 정상 검색
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_self"); // 새로운 창에서 열기.
    return false;
}