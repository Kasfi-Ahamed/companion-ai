pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
    MONGO_URI = 'mongodb://localhost:27017/companion-ai'
    SONAR_TOKEN = credentials('sonarqube-token') // Replace with actual Jenkins credential ID
  }

  tools {
    nodejs 'NodeJS' // Ensure NodeJS is configured in Jenkins Global Tools
  }

  stages {

    stage('Checkout SCM') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        dir('backend') {
          bat 'npm install'
        }
      }
    }

    stage('Run Tests') {
      steps {
        dir('backend') {
          bat 'npm run test -- --coverage'
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
        dir('backend') {
          withSonarQubeEnv('SonarScanner') {
            bat '''
              sonar-scanner ^
                -Dsonar.projectKey=companion-ai ^
                -Dsonar.sources=. ^
                -Dsonar.host.url=http://localhost:9001 ^
                -Dsonar.login=%SONAR_TOKEN% ^
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
            '''
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 10, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

  }

  post {
    always {
      echo 'Pipeline execution complete.'
    }
    failure {
      echo 'Pipeline failed.'
    }
    success {
      echo 'Pipeline succeeded.'
    }
  }
}
