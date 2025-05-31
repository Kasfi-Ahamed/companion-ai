pipeline {
  agent any

  environment {
    MONGO_URI = 'mongodb://mongodb:27017/companion-ai-test'
  }

  stages {

    stage('Checkout SCM') {
      steps {
        git branch: 'main', url: 'https://github.com/Kasfi-Ahamed/companion-ai.git'
      }
    }

    stage('Build') {
      steps {
        dir('backend') {
          bat 'npm install'
        }
      }
    }

    stage('Test') {
      steps {
        script {
          echo "🧪 Starting MongoDB & App containers for tests..."

          bat 'docker-compose -f backend/docker-compose.test.yml down -v || exit 0'
          bat 'docker-compose -f backend/docker-compose.test.yml up -d'

          echo "⏱ Waiting for MongoDB to be ready..."
          bat 'timeout /t 15 > nul'

          echo "🚀 Running tests with coverage..."
          bat 'docker-compose -f backend/docker-compose.test.yml run --rm backend npm run test -- --coverage'
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          bat '''
            echo 🔐 Running npm audit...
            npm audit --json > audit-report.json || exit 0
            echo Done. Review audit-report.json for details.
          '''
        }
      }
    }

    stage('Code Quality') {
      steps {
        dir('backend') {
          echo '📊 Analyzing code with SonarQube (placeholder stage)...'
          // Add real SonarScanner call here if needed
        }
      }
    }

    stage('Deployment') {
      steps {
        echo "🚢 Deploying containers..."
        bat 'docker-compose -f backend/docker-compose.prod.yml up -d --build'
      }
    }

    stage('Release') {
      steps {
        echo "📦 Tagging or notifying release (placeholder)..."
      }
    }

    stage('Monitoring') {
      steps {
        echo "📈 Monitoring setup placeholder (e.g., Prometheus, Grafana)..."
      }
    }
  }

  post {
    always {
      echo '🧹 Cleaning up containers...'
      bat 'docker-compose -f backend/docker-compose.test.yml down -v || exit 0'
      bat 'docker-compose -f backend/docker-compose.prod.yml down -v || exit 0'
    }
    success {
      echo '✅ Pipeline completed successfully!'
    }
    failure {
      echo '❌ Pipeline failed. Check logs above.'
    }
  }
}
