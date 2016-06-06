var jq = $.noConflict();
jq(document).ready(function(){

    var $deleteBtns = jq(".js-delete-btn");
    $deleteBtns.each(function(){
        var self = jq(this);
        jq(self).click(function(){
            var itemToDelete = jq(self).closest("tr").find(".id").text();
            jq.ajax({
                type: 'DELETE',
                url: "/mongodb/" + jq.trim(itemToDelete)
            })
            .done(function(){
                console.log("sucess");
            });
            setTimeout(function() {location.reload();}, 1000);
        });
    });
});