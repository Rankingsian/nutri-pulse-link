from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
from config import config
import os

# Import route blueprints
from routes.auth import auth_bp
from routes.patients import patients_bp
from routes.chatbot import chatbot_bp
from routes.reports import reports_bp

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    migrate = Migrate(app, db)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(patients_bp, url_prefix='/patients')
    app.register_blueprint(chatbot_bp, url_prefix='/chatbot')
    app.register_blueprint(reports_bp, url_prefix='/reports')
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request', 'message': 'Invalid request data'}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized', 'message': 'Authentication required'}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden', 'message': 'Access denied'}), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found', 'message': 'Resource not found'}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({'error': 'Method not allowed', 'message': 'HTTP method not supported'}), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'message': 'Something went wrong'}), 500
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint for monitoring"""
        return jsonify({
            'status': 'healthy',
            'message': 'NutriPulse Health & Nutrition System is running',
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        """Root endpoint with API information"""
        return jsonify({
            'message': 'Welcome to NutriPulse Health & Nutrition System API',
            'version': '1.0.0',
            'description': 'Nurse-Patient Health & Nutrition Interaction System supporting SDG 2 and SDG 3',
            'endpoints': {
                'auth': {
                    'register': 'POST /auth/register',
                    'login': 'POST /auth/login',
                    'profile': 'GET /auth/profile'
                },
                'patients': {
                    'get_patient': 'GET /patients/<id>',
                    'get_records': 'GET /patients/<id>/records',
                    'add_record': 'POST /patients/<id>/records',
                    'get_nutrition': 'GET /patients/<id>/nutrition',
                    'add_nutrition': 'POST /patients/<id>/nutrition',
                    'update_patient': 'PUT /patients/<id>/update'
                },
                'chatbot': {
                    'chat': 'POST /chatbot/chat',
                    'history': 'GET /chatbot/history',
                    'clear_history': 'DELETE /chatbot/clear-history'
                },
                'reports': {
                    'generate_report': 'GET /reports/<id>',
                    'get_summary': 'GET /reports/<id>/summary'
                }
            },
            'sdg_support': {
                'sdg_2': 'Zero Hunger - Nutrition planning and awareness',
                'sdg_3': 'Good Health and Well-being - Health monitoring and preventive care'
            }
        }), 200
    
    return app

if __name__ == '__main__':
    # Get configuration from environment
    config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = create_app(config_name)
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=app.config.get('DEBUG', False)
    )
