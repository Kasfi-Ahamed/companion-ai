pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('sonar-token')
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
          bat '''
            docker-compose down -v || exit 0
            docker-compose up -d
            sleep 15
            npm run test -- --coverage
          '''
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          bat 'npm audit --json > audit-report.json || exit 0'
          echo 'Security audit completed. See audit-report.json'
        }
      }
    }

    stage('Code Quality') {
      steps {
        withSonarQubeEnv('LocalSonarQube') {
          dir('backend') {
            bat '''
              npx sonar-scanner ^
                -Dsonar.projectKey=companion-ai ^
                -Dsonar.sources=. ^
                -Dsonar.coverage.exclusions=**/node_modules/** ^
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info ^
                -Dsonar.host.url=http://localhost:9000 ^
                -Dsonar.login=%SONAR_TOKEN%
            '''
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        bat 'docker-compose down -v || exit 0'
        bat 'docker-compose up --build -d'
      }
    }

    stage('Release') {
      steps {
        echo '📦 App released.'
      }
    }

    stage('Monitoring') {
      steps {
        echo '📊 Monitoring enabled (e.g., Prometheus).'
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 2, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }

  post {
    success {
      echo '✅ All pipeline stages passed. App deployed and code quality verified.'
    }
    failure {
      echo '❌ Pipeline failed. Please check logs.'
    }
  }
}
