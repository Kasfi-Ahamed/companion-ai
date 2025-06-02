pipeline {
  agent any

  environment {
    MONGO_URI = 'mongodb://mongo:27017/companion-ai-test'
    SONAR_TOKEN = credentials('sonarqube-token')
  }

  tools {
    nodejs 'NodeJS'
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
          dir('backend') {
            bat 'docker-compose down -v || exit 0'
            bat 'docker-compose up -d'
            echo '⏳ Waiting for MongoDB container to be healthy...'
            bat 'ping -n 20 127.0.0.1 >nul'
            echo '🚀 Running tests inside the backend container...'
            bat 'docker-compose exec -T backend npm run test -- --coverage'
          }
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
          withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
            withSonarQubeEnv('SonarScanner') {
              bat 'sonar-scanner -Dsonar.projectKey=companion-ai -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.token=%SONAR_TOKEN%'
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

    stage('Deployment') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        echo '🚀 Skipping actual deployment for now...'
      }
    }

    stage('Release') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        echo '📦 Skipping actual release for now...'
      }
    }

    stage('Monitoring') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        echo '📈 Skipping monitoring stage for now...'
      }
    }
  }

  post {
    always {
      echo '🧹 Cleaning up Docker containers...'
      dir('backend') {
        bat 'docker-compose down -v || exit 0'
      }
      echo '❌ Pipeline failed. Check logs for details.'
    }
  }
}
