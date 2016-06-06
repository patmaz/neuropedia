var jq = $.noConflict();
jq(document).ready(function(){
    var $addModal = jq("#add-entry-modal");
    var $editModal = jq("#edit-entry-modal");
    var $deleteBtns = jq(".js-delete-btn");
    var $close = jq(".js-close-btn");
    var $show = jq(".js-show-btn");
    var $editBtns = jq(".js-edit-btn");
    var $saveChangesBtns = jq(".btn-save-changes");

    $show.each(function(){
        var self = jq(this);
        var toShowId = "#" + self.data("show");
        self.click(function(){
            jq(toShowId).removeClass("hidden").addClass("show");
        });
    });

    $close.each(function(){
        var self = jq(this);
        self.click(function(){
            var itemToClose = self.parent();
            itemToClose.removeClass("show").addClass("hidden");
        });
    });

    $editBtns.each(function(){
        var self = jq(this);
        self.click({
            title: jq.trim(self.closest("tr").find(".title").text()),
            body: jq.trim(self.closest("tr").find(".body").text()),
            id: jq.trim(self.closest("tr").find(".id").text())
        },
        function(e){
            $editModal.removeClass("hidden").addClass("show");
            $editModal.find("#titleEdit").val(e.data.title);
            CKEDITOR.instances.bodyEdit.setData(e.data.body);
            $editModal.find(".btn-save-changes").data("id", e.data.id);
        });
    });

    $deleteBtns.each(function(){
        var self = jq(this);
        self.click(function(){
            var itemToDelete = self.closest("tr").find(".id").text();
            jq.ajax({
                type: 'DELETE',
                url: "/mongodb/" + jq.trim(itemToDelete)
            })
            .done(function(){
                $addModal.removeClass("show").addClass("hidden");
                location.reload();
            });
        });
    });

    $saveChangesBtns.each(function(){
        var self = jq(this);
        self.click(function(){
            var title = self.closest("#edit-entry-modal").find("#titleEdit").val();
            var body = CKEDITOR.instances.bodyEdit.getData();
            jq.ajax({
                type: 'PUT',
                url: "/mongodb/" + jq.trim(self.data("id")),
                data: {
                    title: title,
                    body: body
                }
            })
            .done(function(){
                $editModal.removeClass("show").addClass("hidden");
                setTimeout(function() {
                    location.reload();
                }, 500);
            });
        });
    });
});