$(function () {
    var socket = io();

    //Getting the tweet from the input text and sending it to the socket
    $("#sendTweet").submit(function() {
        var content = $("#tweet").val();
        socket.emit("tweet", {content: content});
        $("#tweet").val(" ");
        return false;
    });

    //Listening to incoming tweets and then them to the User interface ie html
    socket.on("incomingTweets", function(data) {
        console.log(data);
        var html = '';

        html += '<div class="media">';
        html += '<div class="media-left">';
        html += '<a href="'+ data.user._id +'"><img class="media-object" src="' + data.user.photo + '" alt="user photo"></a>';
        html += '</div>';
        html += '<div class="media-body">';
        html += '<h4 class="media-heading">' + data.user.name + '</h4>';
        html += '<p>' + data.data.content + '</p>';
        html += '</div></div>';

        $("#tweets").prepend(html);
    });
});


                
                    
                
                
                    
                    
              