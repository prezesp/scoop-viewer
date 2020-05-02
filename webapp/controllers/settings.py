from flask import Blueprint, jsonify, request
from core.config import Config

settings_routes = Blueprint('settings', __name__)

@settings_routes.route('/settings', methods=['GET'])
def get_all():
    mappings = {
        'INSTALLED_ON_TOP': ('bool', 'Show installed apps as top most'),
        'EXTRA_BUCKETS': ('text', 'Path to extra buckets directory')
    }
    config = Config()
    settings = []
    for m in mappings:
        settings.append({
            'id': m,
            'name': mappings[m][1],
            'type': mappings[m][0],
            'value': config.get(m, 'false')
        })
    return jsonify(settings)

@settings_routes.route('/settings/<string:key>', methods=['PUT'])
def put(key):
    config = Config()
    config.save(key, request.json['value'])
    return 'OK'