var jq = $.noConflict();
jq(document).ready(function(){
    var $addModal = jq("#add-entry-modal");
    var $editModal = jq("#edit-entry-modal");
    var $deleteBtns = jq(".js-delete-btn");
    var $closeBtns = jq(".js-close-btn");
    var $showBtns = jq(".js-show-btn");
    var $editBtns = jq(".js-edit-btn");
    var $saveChangesBtns = jq(".btn-save-changes");
    var $modals = jq(".modal");

    function showThis(item) {
        item.removeClass("hidden").addClass("show");
    }

    function hideThis(item) {
        item.removeClass("show").addClass("hidden");
    }

    $showBtns.each(function(){
        var self = jq(this);
        // the id of the item intended to be shown taken from data tag
        var toShowId = "#" + self.data("show");
        self.click(function(){
            showThis(jq(toShowId));
        });
    });

    $closeBtns.each(function(){
        var self = jq(this);
        self.click(function(){
            var itemToClose = self.parent();
            hideThis(itemToClose);
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
            showThis($editModal);
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
                hideThis($editModal);
                setTimeout(function() {
                    location.reload();
                }, 1000);
            });
        });
    });
});