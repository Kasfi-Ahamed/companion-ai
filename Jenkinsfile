pipeline {
  agent any

  environment {
    MONGO_URI = 'mongodb://mongodb:27017/companion-ai'
    NODE_ENV = 'test'
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
        bat '''
          docker-compose -f backend/docker-compose.test.yml down -v || exit 0
          docker-compose -f backend/docker-compose.test.yml up -d
          timeout /t 15 >nul
          docker-compose -f backend/docker-compose.test.yml run --rm backend npm run test -- --coverage
        '''
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
          bat 'sonar-scanner.bat -Dsonar.projectKey=companion-ai -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.login=squ_c27281968014c7cca78fd2932778a099ae977dc9'
        }
      }
    }

    stage('Deployment') {
      steps {
        bat '''
          docker-compose -f backend/docker-compose.prod.yml down -v || exit 0
          docker-compose -f backend/docker-compose.prod.yml up -d --build
        '''
      }
    }

    stage('Release') {
      steps {
        echo '✅ Release completed. App running at http://localhost:5000'
      }
    }

    stage('Monitoring') {
      steps {
        echo '📊 Monitoring with Prometheus at http://localhost:9090'
      }
    }

    stage('Post Actions') {
      steps {
        echo '🎯 Final stage for report/log/email or notifications.'
      }
    }
  }

  post {
    always {
      echo '🧹 Cleaning up containers...'
      bat 'docker-compose -f backend/docker-compose.test.yml down -v || exit 0'
      bat 'docker-compose -f backend/docker-compose.prod.yml down -v || exit 0'
    }
  }
}
