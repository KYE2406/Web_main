//검색창 애니메이션션
  document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search_btn");
    const searchInput = document.getElementById("search_input");
    const wrapper = document.querySelector(".search-wrapper");

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