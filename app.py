import os
from datetime import timedelta

from flask import Flask, redirect, url_for, session
from dotenv import load_dotenv

load_dotenv()

from db.database import init_db
from routes.espace import bp as espace_bp
from routes.portail import bp as portail_bp

app = Flask(__name__, static_url_path="", static_folder="static", template_folder="templates")
app.secret_key = os.environ.get("SESSION_SECRET", "change-me-in-production")
app.permanent_session_lifetime = timedelta(days=7)


@app.before_request
def make_session_permanent():
    session.permanent = True

init_db()

app.register_blueprint(espace_bp)
app.register_blueprint(portail_bp)


@app.route("/")
def index():
    return redirect(url_for("espace.dashboard"))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=False)
