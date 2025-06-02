pipeline {
  agent any

  environment {
    MONGO_URI = 'mongodb://mongo:27017/companion-ai'
    SONAR_TOKEN = credentials('SONAR_AUTH_TOKEN') // Make sure to set this in Jenkins credentials
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
        dir('backend') {
          bat 'npm run test -- --coverage'
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          bat '''
            npm audit --json > audit-report.json || exit 0
            echo Security audit complete.
          '''
        }
      }
    }

    stage('Code Quality') {
      steps {
        dir('backend') {
          bat """
            sonar-scanner ^
              -Dsonar.projectKey=companion-ai ^
              -Dsonar.sources=. ^
              -Dsonar.host.url=http://localhost:9000 ^
              -Dsonar.login=%SONAR_TOKEN%
          """
        }
      }
    }

    stage('Deploy') {
      steps {
        dir('backend') {
          bat 'docker-compose down -v || exit 0'
          bat 'docker-compose up --build -d'
        }
      }
    }

    stage('Release') {
      steps {
        echo '✅ Application released on local Docker. Access via http://localhost:5000'
      }
    }

    stage('Monitoring') {
      steps {
        echo '📊 Monitoring via Prometheus assumed running externally on http://localhost:9090'
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline complete. Check SonarQube and Prometheus.'
    }
    failure {
      echo '❌ Pipeline failed. Please check logs.'
    }
  }
}
