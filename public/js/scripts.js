const comment_btn = document.getElementById("btn-comment");
const comment_box = document.getElementById("post-comment");
comment_box.hidden = true;
comment_btn.addEventListener("click", () => {
  if (comment_box.hidden == true) {
    comment_box.hidden = false;
  } else {
    comment_box.hidden = true;
  }
});

$("#btn-like").on("click", function (event) {
  event.preventDefault();
  var imgId = $(this).data("id");
  $.post("/images/" + imgId + "/like").done(function (data) {
    $(".likes-count").text(data.likes);
  });
});
