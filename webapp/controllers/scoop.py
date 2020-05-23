from flask import Blueprint, jsonify, request
from core.config import Config
from providers import ScoopProvider

scoop_routes = Blueprint('scoop', __name__)

@scoop_routes.route('/scoop/version', methods=['GET'])
def get_version():
    sp = ScoopProvider()
    sp.get_version()
    version = sp.version
    return jsonify({'version': version})


@scoop_routes.route('/scoop/update', methods=['POST'])
def update():
    ScoopProvider().update()
    return 'OK'


@scoop_routes.route('/scoop/cache', methods=['DELETE'])
def delete_cache():
    ScoopProvider().clear_cache()
    return 'OK'