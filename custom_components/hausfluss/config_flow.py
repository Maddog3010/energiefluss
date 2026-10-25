"""Einrichtung und Optionen über die Oberfläche."""
from __future__ import annotations

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import (
    CONF_ADMIN,
    CONF_ICON,
    CONF_TITLE,
    DEFAULT_ICON,
    DEFAULT_TITLE,
    DOMAIN,
)


class HausflussConfigFlow(ConfigFlow, domain=DOMAIN):
    """Ein Klick genügt: Kacheln und Entitäten wählst du später auf der Seite."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return HausflussOptionsFlow()

    async def async_step_user(self, user_input=None) -> ConfigFlowResult:
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            return self.async_create_entry(title="Hausfluss", data={})
        return self.async_show_form(step_id="user")


class HausflussOptionsFlow(OptionsFlow):
    """Eintrag in der Seitenleiste anpassen."""

    async def async_step_init(self, user_input=None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        o = self.config_entry.options
        schema = vol.Schema(
            {
                vol.Required(CONF_TITLE, default=o.get(CONF_TITLE, DEFAULT_TITLE)): str,
                vol.Required(CONF_ICON, default=o.get(CONF_ICON, DEFAULT_ICON)): selector.IconSelector(),
                vol.Required(CONF_ADMIN, default=o.get(CONF_ADMIN, False)): bool,
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
