pipeline {
  agent any

  environment {
    SONAR_HOST_URL = 'http://localhost:9000'
  }

  stages {
    stage('Checkout SCM') {
      steps {
        checkout scm
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
          echo '🧪 Starting MongoDB and Backend using docker-compose...'
          bat 'docker-compose down -v || exit 0'
          bat 'docker-compose up -d'

          echo '⏳ Waiting for MongoDB container to be healthy...'
          bat 'ping -n 20 127.0.0.1 >nul'

          echo '🚀 Running tests inside the backend container...'
          bat 'docker-compose exec -T backend npm run test -- --coverage'
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          echo '🔐 Running security audit...'
          bat 'npm audit --json > audit-report.json || exit 0'
        }
      }
    }

    stage('Code Quality') {
      steps {
        dir('backend') {
          echo '📊 Running SonarScanner...'
          withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
            bat '''
              sonar-scanner.bat ^
                -Dsonar.projectKey=companion-ai ^
                -Dsonar.sources=. ^
                -Dsonar.host.url=%SONAR_HOST_URL% ^
                -Dsonar.token=%sonarqube-token% ^
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
            '''
          }
        }
      }
    }

    stage('Deployment') {
      steps {
        echo '🚀 Deployment stage placeholder...'
      }
    }

    stage('Release') {
      steps {
        echo '📦 Release stage placeholder...'
      }
    }

    stage('Monitoring') {
      steps {
        echo '📈 Monitoring stage placeholder...'
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 1, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }

  post {
    always {
      echo '🧹 Cleaning up...'
      dir('backend') {
        bat 'docker-compose down -v || exit 0'
      }
    }
  }
}
