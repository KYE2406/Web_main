//검색창 애니메이션
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementById("search_btn");
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

  
//검색 시 구글로 이동동
document.getElementByld("search.btn").addEventListener('clck', search.message);

function search_message() {
    alert("검색을 수행합니다!");
}

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    // 새 창에서 구글 검색을 수행
    window.open(googleSearchUrl, "_self"); // 새로운 창에서 열기.
    return false;
}    