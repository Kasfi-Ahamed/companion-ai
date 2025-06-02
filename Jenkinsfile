pipeline {
  agent any

  environment {
    SONARQUBE_ENV = "LocalSonarQube"
    SONAR_AUTH_TOKEN = credentials('SONAR_AUTH_TOKEN')
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
          bat 'npm run test'
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          bat 'npm audit --json > audit-report.json || exit 0'
          echo 'Security audit completed. Check audit-report.json'
        }
      }
    }

    stage('Code Quality') {
      steps {
        withSonarQubeEnv("${env.SONARQUBE_ENV}") {
          dir('backend') {
            bat '''
              npx sonar-scanner ^
                -Dsonar.projectKey=companion-ai ^
                -Dsonar.sources=. ^
                -Dsonar.coverage.exclusions=**/node_modules/** ^
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info ^
                -Dsonar.host.url=http://localhost:9000 ^
                -Dsonar.login=%SONAR_AUTH_TOKEN%
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

    // Optional: Fail pipeline if SonarQube Quality Gate fails
    stage('Quality Gate') {
      steps {
        timeout(time: 2, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }

  post {
    always {
      echo '✅ Pipeline complete. Check SonarQube for reports.'
    }
  }
}
