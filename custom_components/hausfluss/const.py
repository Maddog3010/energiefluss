"""Konstanten für Hausfluss."""
DOMAIN = "hausfluss"
VERSION = "0.0.2"
URL_BASE = "/hausfluss_static"
CARD_FILE = "hausfluss-card.js"
JS_URL = f"{URL_BASE}/{CARD_FILE}?v={VERSION}"

PANEL_PATH = "hausfluss"
PANEL_ELEMENT = "hausfluss-panel"

STORAGE_KEY = "hausfluss.config"
STORAGE_VERSION = 1

CONF_TITLE = "sidebar_title"
CONF_ICON = "sidebar_icon"
CONF_ADMIN = "require_admin"
DEFAULT_TITLE = "Energiefluss"
DEFAULT_ICON = "mdi:home-lightning-bolt"
