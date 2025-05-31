pipeline {
  agent any

  environment {
    MONGO_URI = 'mongodb://mongodb:27017/companion-ai'
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
          echo '🧪 Starting MongoDB & App containers for tests...'
          bat 'docker-compose -f backend/docker-compose.test.yml down -v || exit 0'
          bat 'docker-compose -f backend/docker-compose.test.yml build --no-cache'
          bat 'docker-compose -f backend/docker-compose.test.yml up -d'
          
          echo '⏱ Waiting for MongoDB to be ready...'
          bat 'ping 127.0.0.1 -n 15 > nul'

          echo '📄 Verifying test file inside container...'
          bat 'docker exec backend-backend-1 cat tests/reminder.test.js || echo "❌ File not found"'

          echo '🚀 Running tests with coverage...'
          bat 'docker-compose -f backend/docker-compose.test.yml run --rm backend npm run test -- --coverage'
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          bat 'npm audit --json > audit-report.json || exit 0'
          echo '📋 Security audit complete. Review audit-report.json.'
        }
      }
    }

    stage('Code Quality') {
      steps {
        echo '🔍 Running SonarQube (assumes container exists)...'
        bat 'echo "TODO: Add SonarQube scan here"'
      }
    }

    stage('Deployment') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        echo '🚀 Skipping deployment in test pipeline...'
      }
    }

    stage('Release') {
      steps {
        echo '📦 Release stage (skipped in local runs)'
      }
    }

    stage('Monitoring') {
      steps {
        echo '📊 Monitoring stage (Prometheus or other)'
      }
    }
  }

  post {
    always {
      echo '🧹 Cleaning up containers...'
      bat 'docker-compose -f backend/docker-compose.test.yml down -v || exit 0'
      bat 'docker-compose -f backend/docker-compose.prod.yml down -v || exit 0'
    }

    failure {
      echo '❌ Pipeline failed. Check logs above.'
    }

    success {
      echo '✅ Pipeline completed successfully!'
    }
  }
}
