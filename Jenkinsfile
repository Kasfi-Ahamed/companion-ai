pipeline {
  agent any

  environment {
    MONGO_URI = 'mongodb://localhost:27017/companion-ai'
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
          bat 'npm audit --json > audit-report.json || exit 0'
          echo 'Security audit completed. Check audit-report.json'
        }
      }
    }

    stage('Code Quality') {
      steps {
        dir('backend') {
          bat 'echo Running static code analysis (placeholder)' // Replace with SonarQube if configured
        }
      }
    }

    stage('Deploy') {
      steps {
        bat '''
          docker-compose down -v || exit 0
          docker-compose up --build -d
        '''
      }
    }
  }

  post {
    always {
      echo 'Pipeline execution complete.'
    }
  }
}
