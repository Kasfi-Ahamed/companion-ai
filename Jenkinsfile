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
        dir('backend') {
          bat '''
            docker-compose -f docker-compose.test.yml down -v || exit 0
            docker-compose -f docker-compose.test.yml up -d
            timeout /t 15
            docker-compose -f docker-compose.test.yml exec -T backend npm run test -- --coverage
          '''
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
          bat 'sonar-scanner -Dsonar.projectKey=companion-ai -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.login=YOUR_SONAR_TOKEN'
        }
      }
    }

    stage('Deployment') {
      steps {
        bat '''
          docker-compose -f docker-compose.prod.yml down -v || exit 0
          docker-compose -f docker-compose.prod.yml up -d --build
        '''
      }
    }

    stage('Release') {
      steps {
        echo 'Release stage - could push to production or tag release here.'
      }
    }

    stage('Monitoring') {
      steps {
        echo 'Monitoring enabled via Prometheus and Grafana on port 9090.'
      }
    }

    stage('Post Actions') {
      steps {
        echo 'Final cleanup or notifications can go here.'
      }
    }
  }

  post {
    always {
      echo 'Cleaning up...'
      bat 'docker-compose -f docker-compose.test.yml down -v || exit 0'
      bat 'docker-compose -f docker-compose.prod.yml down -v || exit 0'
    }
  }
}
