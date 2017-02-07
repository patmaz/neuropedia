(function(jq){
    var $toggleChat = jq('#chat__toggle');
    var $chat = jq('#chat');
    var $chatBtn = jq('#chat__btn');
    var $chatWindow = jq('#chat__window');
    var $chatInput = jq('#chat__input');
    var name = jq('body').data('user');
    var ws = new WebSocket('ws://localhost:3000/', 'echo-protocol');

    $toggleChat.on('click', function(){
        $chat.toggleClass('active');
        jq(this).toggleClass('active');
    });

    ws.addEventListener('open', function(e){
        console.log(e);
    });

    $chatBtn.on('click', function(){
        var message = $chatInput.val();
        ws.send(name + ': ' + message);
        $chatInput.val('');
    });

    $chatInput.on('keypress', function(e){
        if(e.which == 10 || e.which == 13) {
            $chatBtn.click();
        }
    });

    ws.addEventListener('message', function(e) {
        console.log(e);
        var msg = e.data;
        $chatWindow
            .append('<span>' + msg + '</span>')
            .animate({ scrollTop: $chatWindow[0].scrollHeight}, 500);
    });
})(jQuery)