pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('sonar-token')
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
        script {
          echo '🧪 Starting MongoDB and Backend using docker-compose...'
        }
        dir('backend') {
          bat 'docker-compose down -v || exit 0'
          bat 'docker-compose up -d'
          echo '⏳ Waiting for MongoDB container to be healthy...'
          bat 'ping -n 20 127.0.0.1 >nul'
          echo '🚀 Running tests inside the backend container...'
          bat 'docker-compose exec -T backend npm run test'
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
            withSonarQubeEnv('SonarScanner') {
              bat 'sonar-scanner -Dproject.settings=sonar-project.properties'
            }
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 3, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
}
