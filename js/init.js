function deleteCookie(cname) {
    document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }


window.onload=function(){
    deleteCookie("details");
    deleteCookie("artwork");
}
