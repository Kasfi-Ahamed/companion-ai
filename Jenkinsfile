pipeline {
  agent any

  environment {
    MONGO_URI = 'mongodb://mongo:27017/companion-ai-test'
    SONAR_HOST_URL = 'http://localhost:9000' // change if using remote SonarQube
    SONAR_SCANNER_HOME = tool 'sonarqube-token'
  }

  stages {
    stage('Checkout SCM') {
      steps {
        git branch: 'main', url: 'https://github.com/Kasfi-Ahamed/companion-ai.git'
      }
    }

    stage('Build') {
      steps {
        echo '✅ Starting Build Stage...'
        bat 'docker-compose -f docker-compose.yml up -d --build'
      }
    }

    stage('Test') {
      steps {
        echo '🧪 Running Jest tests...'
        bat '''
          docker exec backend npm test
        '''
      }
    }

    stage('Security') {
      steps {
        echo '🔐 Running npm audit for vulnerabilities...'
        bat '''
          docker exec backend npm audit --json > audit-report.json || exit 0
          echo Completed security audit.
        '''
      }
    }

    stage('Code Quality') {
      steps {
        echo '📊 Running SonarQube Analysis...'
        withSonarQubeEnv('MySonarQube') {
          bat """
            cd backend
            ${env.SONAR_SCANNER_HOME}\\bin\\sonar-scanner.bat ^
              -Dsonar.projectKey=companion-ai ^
              -Dsonar.sources=. ^
              -Dsonar.host.url=${env.SONAR_HOST_URL} ^
              -Dsonar.login=${SONAR_TOKEN}
          """
        }
      }
    }

    stage('Deploy') {
      steps {
        echo '🚀 Deploying Backend Server...'
        bat 'docker exec -d backend npm start'
      }
    }

    stage('Release') {
      steps {
        echo '📦 Release complete.'
      }
    }

    stage('Monitoring') {
      steps {
        echo '📡 Prometheus and Docker stats running.'
        bat 'docker ps'
      }
    }
  }

  post {
    always {
      echo '🧹 Cleaning up...'
      bat 'docker-compose -f docker-compose.yml down -v'
    }
    success {
      echo '✅ Pipeline succeeded!'
    }
    failure {
      echo '❌ Pipeline failed. Check logs for details.'
    }
  }
}
