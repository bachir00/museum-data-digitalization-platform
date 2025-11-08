"""
Quick start script for DDD Museum Application
"""
import os
import sys
import subprocess

def check_requirements():
    """Check if required files exist"""
    required_files = [
        'app_ddd.py',
        'requirements_ddd.txt',
        '.env.ddd',
        'museum.db'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    return True

def setup_environment():
    """Setup environment for DDD application"""
    print("🔧 Setting up environment...")
    
    # Copy environment file if .env doesn't exist
    if not os.path.exists('.env'):
        if os.path.exists('.env.ddd'):
            try:
                import shutil
                shutil.copy('.env.ddd', '.env')
                print("✅ Environment file copied from .env.ddd")
            except Exception as e:
                print(f"❌ Failed to copy environment file: {e}")
                return False
        else:
            print("❌ No .env.ddd file found")
            return False
    else:
        print("✅ Environment file already exists")
    
    return True

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    
    try:
        subprocess.check_call([
            sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'
        ])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def start_application():
    """Start the DDD application"""
    print("🚀 Starting DDD Museum Application...")
    print("=" * 50)
    print("📱 Frontend URL: http://localhost:5173")
    print("🔗 Backend API: http://localhost:5000")
    print("📚 API Documentation: http://localhost:5000/api/info")
    print("❤️ Health Check: http://localhost:5000/health")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print()
    
    try:
        subprocess.run([sys.executable, 'app_ddd.py'])
    except KeyboardInterrupt:
        print("\n👋 Application stopped")
    except Exception as e:
        print(f"❌ Failed to start application: {e}")

def main():
    """Main function"""
    print("🏛️ Museum Application - Domain-Driven Design")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        print("\n❌ Setup failed - missing required files")
        return
    
    # Setup environment
    if not setup_environment():
        print("\n❌ Setup failed - environment configuration error")
        return
    
    # Install dependencies
    install_choice = input("\n📦 Install dependencies? (y/N): ").lower().strip()
    if install_choice in ['y', 'yes']:
        if not install_dependencies():
            print("\n❌ Setup failed - dependency installation error")
            return
    
    # Start application
    start_choice = input("\n🚀 Start DDD application? (Y/n): ").lower().strip()
    if start_choice not in ['n', 'no']:
        start_application()
    else:
        print("\n✅ Setup completed successfully!")
        print("Run 'python app_ddd.py' to start the application")

if __name__ == "__main__":
    main()