pipeline {
  agent any

  environment {
    MONGO_URI = 'mongodb://localhost:27017/companion-ai'
    JWT_SECRET = 'testsecret'
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
          bat 'ping 127.0.0.1 -n 15 >nul'
          echo '📄 Verifying backend container is up...'
          bat 'docker ps -a'
          bat 'docker logs backend-backend-1'
          echo '📄 Running tests inside container...'
          bat 'docker exec backend-backend-1 npm run test -- --coverage || exit 1'
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          bat 'npm audit --json > audit-report.json || exit 0'
        }
      }
    }

    stage('Code Quality') {
      steps {
        echo '🧪 Skipping SonarQube for now.'
      }
    }

    stage('Deployment') {
      steps {
        echo '🚀 Deployment would go here.'
      }
    }

    stage('Release') {
      steps {
        echo '📦 Packaging for release.'
      }
    }

    stage('Monitoring') {
      steps {
        echo '📈 Prometheus/Grafana Monitoring Placeholder'
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
      echo '✅ Pipeline completed successfully.'
    }
  }
}
