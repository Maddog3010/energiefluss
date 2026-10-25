"""Hausfluss – Modul 3 Energiefluss: stellt die Dashboard-Karte bereit."""
from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url, remove_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CARD_FILE, DOMAIN, URL_BASE, VERSION

_JS_URL = f"{URL_BASE}/{CARD_FILE}?v={VERSION}"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Karte ausliefern und auf jeder Dashboard-Seite laden."""
    data = hass.data.setdefault(DOMAIN, {})
    if not data.get("static_registered"):
        frontend_dir = Path(__file__).parent / "frontend"
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(frontend_dir), False)]
        )
        data["static_registered"] = True
    add_extra_js_url(hass, _JS_URL)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Karte wieder entfernen (wirkt nach dem Neuladen der Seite)."""
    remove_extra_js_url(hass, _JS_URL)
    return True
