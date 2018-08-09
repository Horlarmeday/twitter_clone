$(function () {
    //Follow AJAX CALL
    $(document).on("click", "#follow", function(e) {
        e.preventDefault();
        var user_id = $("#user_id").val();
        $.ajax({
            type: "post",
            url: "/follow/" + user_id,
            success: function (data) {
                $("#follow").removeClass("btn-default").addClass("btn-success")
                .html("Following").attr("id", "unfollow")
            },
            error: function (data) {
                console.log(data);
            }
        });
    });

    //UNFOLLOW AJAX
    $(document).on("click", "#unfollow", function(e) {
        e.preventDefault();
        var user_id = $("#user_id").val();
        $.ajax({
            type: "post",
            url: "/unfollow/" + user_id,
            success: function (data) {
                $("#follow").removeClass("btn-success btn-danger").addClass("btn-default")
                .html("Follow").attr("id", "follow")
            },
            error: function (data) {
                console.log(data);
            }
        });
    });

    //Mouse Hovering
    $(document).on("mouseenter", "#unfollow", function(e) {
        $(this).removeClass("btn-success").addClass("btn-danger").html("Unfollow");
    }); 

    $(document).on("mouseleave", "#unfollow", function(e) {
        $(this).removeClass("btn-danger").addClass("btn-success").html("Following");
    }); 

});