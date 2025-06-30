from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from app.models.user import User

def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if user and user.role == role:
                return fn(*args, **kwargs)
            return jsonify({"message": f"Access forbidden: {role.capitalize()}s only."}), 403
        return decorator
    return wrapper

def agent_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'agent':
            return jsonify({"msg": "Agent access only"}), 403
        return fn(*args, **kwargs)
    return wrapper
