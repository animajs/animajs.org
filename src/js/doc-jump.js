$(document).ready(function() {
  
  $(document).delegate('.doc', 'click', function() {
    $("#pt-main").css('display', 'none');
    $("#iframe").css('display', 'block');
  });
});
