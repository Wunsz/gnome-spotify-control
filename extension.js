const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Lang = imports.lang;

let playerButtons = {
    next: new St.Button({
        reactive: true,
        can_focus: true,
        track_hover: true,
        accessible_name: _("Next track"),
        style_class: 'system-menu-action',
        child: new St.Icon({icon_name: "media-skip-forward-symbolic"})
    }),
    previous: new St.Button({
        reactive: true,
        can_focus: true,
        track_hover: true,
        accessible_name: _("Previous track"),
        style_class: 'system-menu-action',
        child: new St.Icon({icon_name: "media-skip-backward-symbolic"})
    }),
    play: new St.Button({
        reactive: true,
        can_focus: true,
        track_hover: true,
        accessible_name: _("Play track"),
        style_class: 'system-menu-action',
        child: new St.Icon({icon_name: "media-playback-start-symbolic"})
    })
};

function SpotifyControlMenuItem() {
    this._init.apply(this, arguments);
}

SpotifyControlMenuItem.prototype = {
    __proto__: PopupMenu.PopupBaseMenuItem.prototype,

    _init: function (gicon, text, params) {
        PopupMenu.PopupBaseMenuItem.prototype._init.call(this, params);

        this.box = new St.BoxLayout({style_class: 'popup-combobox-item'});

        this.icon = new St.Icon({icon_name: 'edit-clear-symbolic', icon_size: 22});

        this.box.add(this.icon);
        this.label = new St.Label({text: text});
        this.box.add(this.label);

        this.box.add(playerButtons.previous);
        this.box.add(playerButtons.play);
        this.box.add(playerButtons.next);

        this.actor.add(this.box);
    }
};

function GnomeSpotifyControl() {
    this._init.apply(this, arguments);
}

GnomeSpotifyControl.prototype = {
    __proto__: PanelMenu.Button.prototype,

    _init: function () {
        PanelMenu.Button.prototype._init.call(this, 0.0);
        this.connect('destroy', Lang.bind(this, this._onDestroy));
        this._iconActor = new St.Icon({
            icon_name: 'spotify-client',
            style_class: 'system-status-icon'
        });
        this.actor.add_actor(this._iconActor);
        this.actor.add_style_class_name('panel-status-button');

        this._display();

        Main.panel.addToStatusArea('recent-items', this);
    },

    _onDestroy: function () {},

    _display: function () {
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        let menuItem = new SpotifyControlMenuItem(false, 'Clear list', {});
        this.menu.addMenuItem(menuItem);
        menuItem.connect('activate', Lang.bind(this, this._clearAll));
    },

    _clearAll: function () {
        let GtkRecent = new Gtk.RecentManager();
        GtkRecent.purge_items();
    }
};

function init() {}

let gSpotifyControl;

function enable() {
    gSpotifyControl = new GnomeSpotifyControl();
}

function disable() {
    gSpotifyControl.destroy();
}
