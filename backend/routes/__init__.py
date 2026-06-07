from flask import Flask

from . import chatbot, conversations, health, predictions, visualisations

_BLUEPRINTS = (
    health.bp,
    chatbot.bp,
    conversations.bp,
    visualisations.bp,
    predictions.bp,
)


def register_routes(app: Flask) -> None:
    for bp in _BLUEPRINTS:
        app.register_blueprint(bp, url_prefix="/api")
