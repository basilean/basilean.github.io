/*
  Andres Basile
  GNU/GPL v3

*/

class Basile {
    constructor(config) {
        var that = this;
        $.getJSON(config, function(data, status, jq) {
            that.config = data;
            window.schedule = {};
            that.head();
            that.body();
            $.each(that.config['sections'], function(key, data) {
                that.scheduler(key);
            });
        });
    }
    scheduler(app) {
        var actual = window.schedule[app][0];
        var next = actual + 1;
        if (actual >= window.schedule[app][1] - 1) {
            next = 0;
        }
        $("#" + app + "_" + actual).fadeOut(300, function() {
            $("#" + app + "_" + next).css({"display": "inline-flex"}).fadeIn(300);
        });
        window.schedule[app][0] = next;
    }
    over() {
        $(".submenu").css({"display": "none"});
        var data = "#" + $(this).data('over');
        var cont = $(data).clone();
        cont.css({
            "display": "inline-flex"
        });
        $("#overlay").html(cont).css({
            "display": "block"
        }).prepend(
            $("<div>", {
                "id": "overlay_close"
            }).on("click", function() {
                $(this).parent().css({
                    "display": "none"
                })
            })
        )
    }
    section(data) {
        console.log(data);
    }
    head() {
        var header = $("head");
        header.append("<title>:: " + this.config['title'] + " :: " + this.config['description'] + " :.</title>");
        header.append('<meta property="og:title" content=":: ' + this.config['title'] + ':." />');
    }
    body() {
        var that = this;
        this.overlay = $("<div>", {
            "id": "overlay"
        });
        this.menu = $("<div>", {
            "id": "menu"
        });
        this.page = $("<div>", {
            "id": "page"
        }).append(
            $("<div>", {
                "id": "navbar"
            }).append(
                $("<div>", {
                    "id": "logo"
                }).append(
                    $("<div>", {
                        "text": this.config['title']
                    })
                )
            ).append($("<div>", {"id": "tools"}).append(
                $("<div>", {
                    "id": "langs"
                }).append(
                    $.map(this.config['langs'], function(data, key) {
                        return $("<div>", {
                            "class": "lang",
                            "id": "lang_" + key,
                            "data-locale": key
                        }).on("click", function(e) {
                            $.i18n().locale = $(this).data('locale');
                            $("body").i18n();
                        });
                    })
                )
            ).append(
                this.menu
            ))
        ).append(
            $("<div>", {
                "id": "sections"
            }).append(
                $.map(this.config['sections'], function(data, key) {
                    window.schedule[key] = [
                        0,
                        data['items'].length,
                        setInterval(
                            that.scheduler,
                            data['speed'],
                            key
                        )
                    ];
                    var content = $("<div>", {
                        "class": "section_content section_content_" + key
                    });
                    var submenu = $("<div>", {
                        "class": "submenu submenu_" + key
                    });
                    that.menu.append($("<div>", {
                        "class": "menu menu_" + key
                    }).append($("<div>", {
                        "class": "menu_title menu_title_" + key,
                        "data-i18n": key + "_title",
                    }).on("click", function() {$(this).next().slideToggle('600');})).append(submenu));
                    $.map(data['items'], function(item, idx) {
                        submenu.append($("<div>", {
                            "class": "submenu_title submenu_title_" + key + "_" + idx,
                            "data-i18n": key + "_" + idx + "_title",
                            "data-over": key + "_" + idx,
                        }).on(
                            "click",
                            that.over,
                        ));
                        content.append(
                            $("<div>", {
                                "class": "section_content_item section_content_item_" + key,
                                "id": key + "_" + idx,
                                "data-over": key + "_" + idx,
                            }).append(
                                $("<div>", {
                                    "class": "section_content_item_l section_content_item_l_" + key,
                                    "id": key + "_" + idx + "_l",
                                }).append(
                                    $("<pre>", {
                                        "data-i18n": item[0]
                                    })
                                )
                            ).append(
                                $("<div>", {
                                    "class": "section_content_item_r section_content_item_r_" + key,
                                    "id": key + "_" + idx + "_r",
                                }).append(
                                    $("<pre>", {
                                        "data-i18n": item[1]
                                    })
                                )
                            ).on('click', that.over)
                        );
                            //console.log(key, item, idx);
                    })
                    return $("<div>", {
                        "class": "section",
                         "id": "section_" + key
                    }).append(
                        $("<div>", {
                            "class": "section_title"
                        }).append(
                            $("<h1>", {
                                "data-i18n": data['title']
                            })
                        )
                    ).append(
                        content
                    );
                })
            )
        ).append(
            this.overlay
        ).append(
            $("<div>", {
                "id": "credits"
            }).append(
                $("<p>", {
                    "text": "Powered by "
                }).append(
                    $("<a>", {
                        "text": this.config['title'],
                        "href": window.location.href
                    })
                )
            )
        );
        $("body").append(this.page);
        $.i18n().load(this.config['langs']).done(function() {
            $("body").i18n();
        });
        $(window).scroll(function() {
            var off = $(this).scrollTop() * -0.02;
            that.page.css({
                "background-position-y": off + "em"
            });
        });
    }
}

