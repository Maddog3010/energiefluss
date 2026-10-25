"""Hausfluss – Modul 3 Energiefluss: Karte plus eigene Seite in der Seitenleiste."""
from __future__ import annotations

from pathlib import Path

import voluptuous as vol
from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    CONF_ADMIN,
    CONF_ICON,
    CONF_TITLE,
    DEFAULT_ICON,
    DEFAULT_TITLE,
    DOMAIN,
    JS_URL,
    PANEL_ELEMENT,
    PANEL_PATH,
    STORAGE_KEY,
    STORAGE_VERSION,
    URL_BASE,
)


@websocket_api.websocket_command({vol.Required("type"): "hausfluss/get_config"})
@websocket_api.async_response
async def ws_get_config(hass: HomeAssistant, connection, msg) -> None:
    """Gespeicherte Kartenkonfiguration der Seite liefern."""
    config = await hass.data[DOMAIN]["store"].async_load()
    connection.send_result(msg["id"], {"config": config})


@websocket_api.websocket_command(
    {vol.Required("type"): "hausfluss/set_config", vol.Required("config"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set_config(hass: HomeAssistant, connection, msg) -> None:
    """Kartenkonfiguration speichern (nur Administratoren)."""
    await hass.data[DOMAIN]["store"].async_save(msg["config"])
    connection.send_result(msg["id"], {})


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Karte ausliefern, Seite in der Seitenleiste anlegen."""
    data = hass.data.setdefault(DOMAIN, {})
    if not data.get("ready"):
        frontend_dir = Path(__file__).parent / "frontend"
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(frontend_dir), False)]
        )
        data["store"] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        websocket_api.async_register_command(hass, ws_get_config)
        websocket_api.async_register_command(hass, ws_set_config)
        data["ready"] = True

    # Karte steht in jedem Dashboard zur Verfügung
    frontend.add_extra_js_url(hass, JS_URL)

    # Eigene Seite links in der Seitenleiste
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_PATH,
        webcomponent_name=PANEL_ELEMENT,
        module_url=JS_URL,
        sidebar_title=entry.options.get(CONF_TITLE, DEFAULT_TITLE),
        sidebar_icon=entry.options.get(CONF_ICON, DEFAULT_ICON),
        require_admin=entry.options.get(CONF_ADMIN, False),
        config={},
    )
    entry.async_on_unload(entry.add_update_listener(_options_updated))
    return True


async def _options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Titel, Symbol oder Zugriff geändert: Eintrag neu laden."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Seite und Karte wieder entfernen."""
    frontend.async_remove_panel(hass, PANEL_PATH)
    frontend.remove_extra_js_url(hass, JS_URL)
    return True
